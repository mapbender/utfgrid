<?php

namespace Mapbender\UTFGridBundle\Element\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class UTFGridInstanceAdminType extends AbstractType
{

    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'utfgridinstance';
    }

    /**
     * @inheritdoc
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('url', 'text', array(
                'required' => true))
            ->add('layer', 'text', array(
                'required' => true));
            // TODO: Add field to define output format
            // ->add('format', 'textarea');
    }

}
