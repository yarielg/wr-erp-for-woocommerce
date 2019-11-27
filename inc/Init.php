<?php

namespace Wrerp\Inc;

final class Init{

    public static function get_services(){

        return [
            Base\Enqueue::class,
            Base\Pages::class,
            Controller\ProductsController::class,
            Controller\QuotationsController::class,

        ] ;
    }

    public static function register_services(){

        foreach (self::get_services() as $class) {
            $service = self::instantiate($class);
            if(method_exists( $service , 'register')){
                $service->register();
            }
        }

    }

    private static function instantiate($class){

        $service = new $class();
        return $service;
    }

}
