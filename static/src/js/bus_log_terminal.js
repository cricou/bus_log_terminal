odoo.define('bus.log.terminal', function(require){
    "use strict";
    var widgetRegistry = require('web.widget_registry');
    var Widget = require('web.Widget');

    var BusLogTerminal = Widget.extend({
        
        template: 'BusLogTerminal',
       
        init: function (parent, state, options) {
            this._destroy_active_widgets(parent.widgets);
            this._super.apply(this, arguments);
            this.widget = "bus_log_terminal";
            this.model = state.model
            this.bus_channels = {};
            this.res_id = state.res_id
            this.attrs = options.attrs
            this.processing_log = false;
        },
        _destroy_active_widgets: function(widgets){
            widgets.forEach(element => {
                if(element.widget && element.widget == "bus_log_terminal"){
                    element.destroy();
                }
            });
        },
        _get_channel(){
            if(this.attrs && this.attrs.channel){
                var result = this.attrs.channel
            }else{
                var result = this.model + "_" + this.res_id;
            }
            return result
        },
        _add_channel(channel){
            if(!(channel in this.bus_channels)) {
                this.bus_channels[channel] = true;
                this.call('bus_service', 'addChannel', channel);
            }
        },
        _process_message(term, message, options=null){
            switch (message.level) {
                case 'info':
                    this._info_log(term, message, options);
                  break;
                case 'warn':
                    this._warn_log(term, message, options);
                    break;
                case 'error':
                    this._error_log(term, message, options);
                    break;
                case 'critical':
                    this._critical_log(term, message, options);
                    break;
                case 'processing':
                    this._processing_log(term, message, options);
                    break;
                default:
                    this._default_log(term, message, options);
              }
        },
        _default_log(term, message, options){
            if(this.processing_log == true){
                term.write('\r\n');
                this.processing_log = false; 
            }
            term.write(message.timestamps + ' ' + message.message + '\r\n')
        },
        _info_log(term, message, options){
            if(this.processing_log == true){
                term.write('\r\n');
                this.processing_log = false; 
            }
            term.write(message.timestamps + ' \u001B[32mINFO\u001b[37m ' + message.message + '\r\n')
        },
        _warn_log(term, message, options){
            if(this.processing_log == true){
                term.write('\r\n');
                this.processing_log = false; 
            }
            term.write(message.timestamps + ' \u001B[33mWARNING\u001b[37m ' + message.message + '\r\n')
        },
        _error_log(term, message, options){
            if(this.processing_log == true){
                term.write('\r\n');
                this.processing_log = false; 
            }
            term.write(message.timestamps + ' \u001B[31mERROR\u001b[37m ' + message.message + '\r\n')
        },
        _critical_log(term, message, options){
            if(this.processing_log == true){
                term.write('\r\n');
                this.processing_log = false; 
            }
            term.write(message.timestamps + ' \u001B[31mCRITICAL\u001b[37m ' + message.message + '\r\n')
        },
        _processing_log(term, message, options){
            if(this.processing_log == true){
                term.write('\x1b[2K\r');
            }
            term.write(message.message);
            this.processing_log = true;
        },
        _channel_connexion_message(term, channel){
            term.write("\u001b[37mConnected to \u001B[33m" + channel + " \u001b[37mchannel\r\n");
        },
        start: function () {
            try{
                var fit = new FitAddon.FitAddon();
                var term = new Terminal({
                    convertEol: true,
                    fontFamily: `'Fira Mono', monospace`,
                    fontSize: 15
                  });
                term.loadAddon(fit);
                term.setOption('theme', { background: '#0b0f22' });

                var checkExist = setInterval(function() {
                    if ($('#bus_log_terminal').length) {
                        term.open(document.getElementById('bus_log_terminal'));
                        fit.fit();
                        clearInterval(checkExist);
                    }
                 }, 100);

                var channel_name = this._get_channel();

                this._add_channel(channel_name);

                this.call('bus_service', "onNotification", this, function (notification){
                    notification.forEach(message => {
                        var bus = message[0];
                        var message = message[1];
                        if(bus == channel_name && message.widget == "bus_log_terminal"){
                            this._process_message(term, message);
                        }
                    });
                });

                this.call('bus_service', 'startPolling');
                this._channel_connexion_message(term, channel_name);

            } catch(error)
            {
                console.log(error);
            }
            return this._super.apply(arguments);
        },
        bus_delete_channel: function(channel) {
            this.call('bus_service', 'deleteChannel', channel);
            this.bus_channels = _.omit(this.bus_channels, channel);
        },
        destroy(){
            _.each(this.bus_channels, function(method, channel) {
                this.bus_delete_channel(channel);
            }, this);
            this.call('bus_service', 'stopPolling');
            this._super.apply(this, arguments);
        }

    });
widgetRegistry.add('bus_log_terminal', BusLogTerminal);
}); 
