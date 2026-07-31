<?php
/**
 * FrontAccounting Enterprise REST API — Domain Event Dispatcher
 */

class EventDispatcher {
    private static $listeners = [];

    public static function listen($eventName, callable $listener) {
        self::$listeners[$eventName][] = $listener;
    }

    public static function dispatch($eventName, $eventData = null) {
        Logger::info("Event Dispatched: {$eventName}", ['data' => $eventData]);

        if (isset(self::$listeners[$eventName])) {
            foreach (self::$listeners[$eventName] as $listener) {
                call_user_func($listener, $eventData);
            }
        }
    }
}
