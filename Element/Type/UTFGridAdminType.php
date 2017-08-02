<?php

namespace Mapbender\UTFGridBundle\Element\Type;


use Mapbender\CoreBundle\Component\ExtendedCollection;
use Mapbender\CoreBundle\Element\Map;
use Mapbender\CoreBundle\Entity\Application;
use Mapbender\CoreBundle\Entity\Layerset;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Security\Acl\Exception\Exception;

/**
 * UTFGridAdminType
 *
 * @author Stefan Winkelmann <stefan.winkelmann@wheregroup.com>
 */
class UTFGridAdminType extends AbstractType implements ExtendedCollection
{

    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'utfgrid';
    }

    /**
     * @inheritdoc
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'application' => null,
            'element' => null
        ));
    }

    /**
     * @inheritdoc
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $application = $options["application"];
//        $wmsServices = array();

        $builder->add('target', 'target_element',
            array(
                'element_class' => 'Mapbender\\CoreBundle\\Element\\Map',
                'application' => $application,
                'property_path' => '[target]',
                'required' => false))
            ->add('autoActivate', 'checkbox', array('required' => false))
            ->add('instances', "collection", array(
                'property_path' => '[instances]',
                'type' => new UTFGridInstanceAdminType(),
                'allow_add' => true,
                'allow_delete' => true,
                'auto_initialize' => false
            ));




    }

    /**
     * @param $mapConfiguration
     * @param $layerset
     * @return bool
     */
    public function checkIfLayerset($mapConfiguration, $layerset)
    {
        return isset($mapConfiguration['layerset']) && strval($mapConfiguration['layerset']) === strval($layerset->getId());
    }

  /**
     * @param $mapConfiguration
     * @param $layerset
     * @return bool
     */
    public function checkIfInLayerset($mapConfiguration, $layerset)
    {
        return  isset($mapConfiguration['layersets']) && in_array($layerset->getId(), $mapConfiguration['layersets']);
    }

}