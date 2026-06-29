<?php

namespace Modules\Core\Http\Responses\Api\V1;

use Modules\Core\Http\Responses\BaseApiResponse;
use Modules\Core\Contracts\DTO\BaseDtoInterface;

class VersionResponse extends BaseApiResponse
{
    public function data(mixed $data): static
    {
        if ($data instanceof BaseDtoInterface) {
            $data = $data->data();
        } elseif (!is_array($data)) {
            $data = (array)$data; // convert objects or scalar to array
        }
        $this->data = $data;
        return $this;
    }

    public function meta(array|BaseDtoInterface $meta): static
    {
        if ($meta instanceof BaseDtoInterface) {
            $meta = $meta->meta();
        }
        $this->meta = $meta;
        return $this;
    }
}
