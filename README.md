
# Odoo bus log terminal

This widget is an logger terminal using bus service from Odoo.

## Usage

To use this module, you need to decorate xml with widget ``bus_log_terminal`` on form view, the default channel is ``model_name``_``res_id``

.. code-block:: xml

    <field>
        <form string="Form name">
            <sheet>
                <group>
                    <widget name="bus_log_terminal">
                </group>
            </sheet>
        </form>
    </field>

## Options

The ``Bus log terminal`` accepts an optional ``channel`` argument. this argument lock the terminal on this channel

.. code-block:: xml

    <widget name="bus_log_terminal" channel="channel_name">

## About
### Author

* Cyril RICOU