<?php

header('Content-Type: text/plain; charset=utf-8');

$passwords = [
    'admin123',
    'free123',
    'premium123'
];

foreach ($passwords as $password) {
    echo $password . ":\n";
    echo password_hash($password, PASSWORD_DEFAULT);
    echo "\n\n";
}
