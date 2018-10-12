<?php
// src/AppBundle/Entity/Message.php
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="message")
 */
class Message
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=300)
     */
    private $message;

    public function getId()
    {
        return $this->id;
    }

    public function setId($name) { 
      $this->id = $id;  
      return $this; 
    }  

    public function getMessage()
    {
        return $this->message;
    }

    public function setMessage($message) { 
      $this->message = $message;  
      return $this; 
    }
}

