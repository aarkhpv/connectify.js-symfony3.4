<?php
// src/AppBundle/Controller/NewMessageController.php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use AppBundle\Entity\Message;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class NewMessageController extends Controller
{
    /**
     * @Route("/newmessage")
     */
    public function createAction()
    {
        // you can fetch the EntityManager via $this->getDoctrine()
        // or you can add an argument to your action: createAction(EntityManagerInterface $entityManager)
        $entityManager = $this->getDoctrine()->getManager();

        $message = new Message();
        $message->SetMessage($_POST['message']);

        // tells Doctrine you want to (eventually) save the message (no queries yet)
        $entityManager->persist($message);

        // actually executes the queries (i.e. the INSERT query)
        $entityManager->flush();

        $connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
        $channel = $connection->channel();
        $channel->queue_declare('messageChannel', false, false, false, false);

        $postMessage = array('messageId' => $message->getId(),'messageText' => $message->getMessage());
        $postMessage = json_encode($postMessage);

        $msg = new AMQPMessage($postMessage);
        $channel->basic_publish($msg, '', 'messageChannel');

        $channel->close();
        $connection->close();

        return new Response('Saved new message with id '.$message->getId());
    }

  /**
   * @Route("/http")
   */
  public function getNewMessages(Request $request)
  {
    $lastMessageIdOnClient = $_GET['id'];
    
    if ($lastMessageIdOnClient == 'null') {
      $lastMessageIdOnClient = 0;
    }

    $entityManager = $this->getDoctrine()->getManager();
    $query = $entityManager->createQuery(
      'SELECT p.id, p.message
      FROM AppBundle:Message p
      WHERE p.id > :lastMessageIdOnClient
      ORDER BY p.id ASC'
    )->setParameter('lastMessageIdOnClient', $lastMessageIdOnClient);

    $messages = $query->getResult();
    return new JsonResponse($messages);
  }

}

