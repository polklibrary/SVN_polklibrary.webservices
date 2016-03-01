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
        self._data = {}
        self.legacy()
        self.process()
        
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

        
    def legacy(self):
        
        locations = []
    
        # All PC Computers
        results = self._simple_query(select(['name,id'],or_('id=3','id=5','id=6','id=7','id=8','id=9','id=10'),'locations'))
        for result in results:
            data = self._simple_query(select(['computername,status'], and_('location_id='+str(result['id']),'is_mac=0'),'computers'))
            if data:
                available, unavailable, resources = 0, 0, []
                for d in data:
                    resources.append({'name' : d['computername'], 'status' : d['status']})
                    if item['status'] == 1: 
                        available += 1
                    else: 
                        unavailable += 1
            
                locations.append({'name' : result['name'], 
                                  'type' : 'PC',
                                  'available' : available, 
                                  'unavailable' : unavailable, 
                                  'total' : (available+unavailable), 
                                  'resources' : resources
                })

                
                
                
                
        self._data = {
            'locations' : locations
        }
        
        
    def process(self):
        pass
        
        
    
    def _simple_query(self,statement):
        if statement.__class__.__name__ != "Select": return []
        
        engine = None
        resultProxy = None
        try:
            url = 'root:@localhost:3306/libraryresources'
            engine = create_engine('mysql://' + url, echo=False, module=pymysql, strategy='threadlocal')
            resultProxy = engine.execute(statement) #execute handles failure
            results = resultProxy.fetchall()
            return results
        except Exception as e:
            print str(e)
            return []
        finally:
            try:
                if resultProxy:
                    resultProxy.close()
                if engine:
                    engine.dispose()
            except Exception as e: 
                print str(e)
        
        
        
    @property
    def portal(self):
        return api.portal.get()
        