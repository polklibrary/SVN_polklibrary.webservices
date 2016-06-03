from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

from sqlalchemy import create_engine
from sqlalchemy.sql import select,update,functions,or_,and_

import json,pymysql

class WSView(BrowserView):

    _data = {}
    
    #@ram.cache(lambda *args: time() // (60 * 10))
    def __call__(self):
        self._data = {
            'study_areas' : [],
            'locations' : [],
        }
        self.process()
        
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

    def process(self):
        """ do main work here """
        
        
        
        
        
        
        
        
        
        

        
    @property
    def portal(self):
        return api.portal.get()
        