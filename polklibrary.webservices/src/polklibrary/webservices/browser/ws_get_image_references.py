from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time

class WSView(BrowserView):


    def __call__(self):
    
        start = int(self.request.form.get('start','0'))
        limit = int(self.request.form.get('limit','10'))
        
        brains = api.content.find(
            portal_type=(
                'Image',
            ),
            sort_on='path',
        )[start:limit]
        
        data = self.deep_search(brains)
        
        output = ""
        for brain in brains:
           
            output += '<div>'
            output += '<a href="'+brain.getURL()+'/view"><img src="' + brain.getURL() + '/@@images/image/preview" /></a> <br>'
           
            if brain.getId in data:
                output += 'Found on <br>'
                for link in data[brain.getId]['FoundAt']:
                    output += '<a href="'+link+'">' + link + '</a> <br>'
           
            output += '</div><br><br>'
            
        return output



    def deep_search(self, img_brains):
        path_purge = self.request.form.get('path_purge','/library')
        
        print("DEEP SEARCH --")
        
        targets = {}
        
        for brain in img_brains:
            targets[brain.getId] = {
                'UID':brain.UID, 
                'Path': brain.getPath().replace(path_purge,''),
                'FoundAt': [],
            }
        
        
        print(targets)
        
        brains = api.content.find(portal_type=(
            'polklibrary.type.templater.models.templater',
            'polklibrary.type.coursepages.models.page',
            'polklibrary.type.subjects.models.subject',
            'Document',
            'Link',
            'Collection',
        ))
        for brain in brains:
            obj = brain.getObject()
            
            for id,target in targets.items():
            
                if hasattr(obj, 'text') and obj.text != None:
                    if target['UID'] in obj.text.output or target['Path'] in obj.text.output:
                        targets[id]['FoundAt'].append(brain.getURL())
                elif hasattr(obj, 'body') and obj.body != None:
                    if target['UID'] in obj.body.output or target['Path'] in obj.body.output:
                        targets[id]['FoundAt'].append(brain.getURL())                        
                elif hasattr(obj, 'html') and obj.html != None:
                    if target['UID'] in obj.html or target['Path'] in obj.html:
                        targets[id]['FoundAt'].append(brain.getURL())
                elif brain.getRemoteUrl and (target['UID'] in brain.getRemoteUrl or target['Path'] in brain.getRemoteUrl):
                    targets[id]['FoundAt'].append(brain.getURL())
        
    
    
    
        print("----")
        return targets
        

    @property
    def portal(self):
        return api.portal.get()

