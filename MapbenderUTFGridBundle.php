<?php
namespace Mapbender\UTFGridBundle;
use Mapbender\CoreBundle\Component\MapbenderBundle;

/**
 * Class UTFGridBundle
 *
 * @package Mapbender\UTFGridBundle
 * @author  Mohamed Tahrioui <mohamed.tahrioui@wheregroup.com>
 */
class MapbenderUTFGridBundle extends MapbenderBundle
{
    /**
     * @inheritdoc
     */
    public function getElements()
    {
        return array(
            'Mapbender\UTFGridBundle\Element\UTFGrid'
        );
    }
}
