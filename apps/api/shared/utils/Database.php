<?php
/**
 * FrontAccounting Enterprise REST API — PDO Database & Transaction Manager
 */

class Database {
    private static $instance = null;

    public static function pdo() {
        if (self::$instance === null) {
            $host = Config::get('db_host');
            $port = Config::get('db_port');
            $dbname = Config::get('db_name');
            $user = Config::get('db_user');
            $pass = Config::get('db_pass');

            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
            self::$instance = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        }
        return self::$instance;
    }

    public static function transaction(callable $callback) {
        $pdo = self::pdo();
        try {
            $pdo->beginTransaction();
            $result = $callback($pdo);
            $pdo->commit();
            return $result;
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }
}
