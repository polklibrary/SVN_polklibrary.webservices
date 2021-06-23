from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time

class WSView(BrowserView):

    output = ""

    def __call__(self):
        self._data = {}
        self.process()
        return self.output

    def process(self):
        """ do main work here """
        self.output = ""
        text = self.request.form.get('find', '')
        if text:
            self.output += "Found text '" + text + "' in the following content. <br /><br />"
            brains = api.content.find(portal_type=(
                'polklibrary.type.templater.models.templater',
                'polklibrary.type.coursepages.models.page',
                'polklibrary.type.subjects.models.subject',
                'polklibrary.type.rdb.models.database',
                'Document',
                'Link',
                'Collection',
                'Folder',
            ))
            for brain in brains:
                obj = brain.getObject()
                
                if hasattr(obj, 'text') and obj.text != None:
                    if text in obj.text.output:
                        self.output += '<a href="' + brain.getURL() + '">' + brain.Title + '</a> (' + brain.portal_type + ')<br />'
                
                elif hasattr(obj, 'body') and obj.body != None:
                    if text in obj.body.output:
                        self.output += '<a href="' + brain.getURL() + '">' + brain.Title + '</a> (' + brain.portal_type + ')<br />'
                        
                elif hasattr(obj, 'html') and obj.html != None:
                    if text in obj.html:
                        self.output += '<a href="' + brain.getURL() + '">' + brain.Title + '</a> (' + brain.portal_type + ')<br />'
                        
                elif brain.getRemoteUrl and text in brain.getRemoteUrl:
                    self.output += '<a href="' + brain.getURL() + '">' + brain.Title + '</a> (' + brain.portal_type + ')<br />'
                        
                elif brain.Title and text in brain.Title:
                    self.output += '<a href="' + brain.getURL() + '">' + brain.Title + '</a> (' + brain.portal_type + ')<br />'
                        
                elif brain.Description and text in brain.Description:
                    self.output += '<a href="' + brain.getURL() + '">' + brain.Title + '</a> (' + brain.portal_type + ')<br />'
                        

    @property
    def portal(self):
        return api.portal.get()

