<?php
namespace Modules\Core\Contracts\DTO;

interface BaseDtoInterface
{
    /**
     * Convert DTO to array
     * @return array
     */
    public function toArray():array;

    /**
     * use for data structure
     * @return array
     */
    public function data():array;

    /**
     * use for meta structure
     * @return array
     */
    public function meta():array;

}
