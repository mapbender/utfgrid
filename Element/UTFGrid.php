<?php
namespace Mapbender\UTFGridBundle\Element;

use Mapbender\CoreBundle\Component\Element;

/**
 * UTFGrid Element
 *
 * @author Stefan Winkelmann <stefan.winkelmann@wheregroup.com>
 */
class UTFGrid extends Element
{

    /**
     * @inheritdoc
     */
    static function getClassTitle()
    {
        return "UTF Grid";
    }

    /**
     * @inheritdoc
     */
    static function getClassDescription()
    {
        return "UTF Grid";
    }

    /**
     * @inheritdoc
     */
    static function getClassTags()
    {
        return array(
            "mb.core.utfgrid.tag.utf",
            "mb.core.utfgrid.tag.grid");
    }

    /**
     * @inheritdoc
     */
    static function getDefaultConfiguration()
    {
        return array(
            'target' => null
        );
    }

    /**
     * @inheritdoc
     */
    public function getWidgetName()
    {
        return 'mapbender.mbUTFGrid';
    }

    /**
     * @inheritdoc
     */
    public static function getType()
    {
        return 'Mapbender\UTFGridBundle\Element\Type\UTFGridAdminType';
    }

    /**
     * @inheritdoc
     */
    static public function listAssets()
    {
        return array(
            'js' => array('mapbender.element.utfgrid.js'),
            'css' => array('@MapbenderUTFGridBundle/Resources/public/sass/element/utfgrid.scss'));
    }

    /**
     * @inheritdoc
     */
    public function getConfiguration()
    {
        $config = parent::getConfiguration();
        $signer = $this->container->get('signer');

        if (isset($config["instances"])) {
            foreach ($config["instances"] as &$instance) {
                $instance['url'] = $signer->signUrl($instance['url']);
            }
        }

        return $config;
    }

    /**
     * @inheritdoc
     */
    public function render()
    {
        return $this->container->get('templating')
                ->render('MapbenderUTFGridBundle:Element:utfgrid.html.twig',
                    array('id' => $this->getId(),
                    'title' => $this->getTitle(),
                    'configuration' => $this->getConfiguration()));
    }

    /**
     * @inheritdoc
     */
    public static function getFormTemplate()
    {
        return 'MapbenderUTFGridBundle:ElementAdmin:utfgrid.html.twig';
    }

}
