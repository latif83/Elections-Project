<?php

class dbConnect{

    private $username;
    private $password;
    private $host;
    private $db;
    private $connection;

    function __construct($username,$password,$host,$db){
        $this->username = $username;
        $this->password = $password;
        $this->host = $host;
        $this->db = $db;
    }

    public function connect() {
        $this->connection = mysqli_connect($this->host, $this->username, $this->password, $this->db);

        if (!$this->connection) {
            die('Database connection error: ' . mysqli_connect_error());
        }

        return $this->connection;
    }

    public function disconnect() {
        if ($this->connection) {
            mysqli_close($this->connection);
            $this->connection = null;
        }
    }

}

?>