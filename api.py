from datetime import datetime
import logging

from odoo import tools

_logger = logging.getLogger(__name__)

class BLTController:

    def info(self, bus, message):
        date = datetime.now().strftime(tools.DEFAULT_SERVER_DATETIME_FORMAT)
        self.env()['bus.bus'].sudo().sendone(bus , {'widget': 'bus_log_terminal',
                                                    'timestamps': date,
                                                    'level': 'info',
                                                    'message': message})
    
    def warn(self, bus, message):
        date = datetime.now().strftime(tools.DEFAULT_SERVER_DATETIME_FORMAT)
        self.env()['bus.bus'].sudo().sendone(bus , {'widget': 'bus_log_terminal',
                                                    'timestamps': date,
                                                    'level': 'warn',
                                                    'message': message})
    
    def error(self, bus, message):
        date = datetime.now().strftime(tools.DEFAULT_SERVER_DATETIME_FORMAT)
        self.env()['bus.bus'].sudo().sendone(bus , {'widget': 'bus_log_terminal',
                                                    'timestamps': date,
                                                    'level': 'error',
                                                    'message': message})
    
    def critical(self, bus, message):
        date = datetime.now().strftime(tools.DEFAULT_SERVER_DATETIME_FORMAT)
        self.env()['bus.bus'].sudo().sendone(bus , {'widget': 'bus_log_terminal',
                                                    'timestamps': date,
                                                    'level': 'critical',
                                                    'message': message})

    def processing(self, bus, message):
        date = datetime.now().strftime(tools.DEFAULT_SERVER_DATETIME_FORMAT)
        self.env()['bus.bus'].sudo().sendone(bus , {'widget': 'bus_log_terminal',
                                                    'timestamps': date,
                                                    'level': 'processing',
                                                    'message': message})
            
    def message(self, bus, message):
        date = datetime.now().strftime(tools.DEFAULT_SERVER_DATETIME_FORMAT)
        self.env()['bus.bus'].sudo().sendone(bus , {'widget': 'bus_log_terminal',
                                                    'timestamps': date,
                                                    'level': 'default',
                                                    'message': message})



    
    

