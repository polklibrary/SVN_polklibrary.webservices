from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time

class WSView(BrowserView):


    def __call__(self):
        
        brains = api.content.find(
            portal_type=(
                'polklibrary.type.citations.models.citation',
                'polklibrary.type.rdb.models.database',
                'polklibrary.type.subjects.models.subject',
                'polklibrary.type.templater.models.templater',
                'Document',
                'Folder',
                'Link',
                'EasyForm',
                'File',
            ),
            sort_on='path',
        )
        
        output = "Title,Path,Type,State,Updated\n"
        for brain in brains:
           output += '"' + brain.Title.replace('"','').replace(',',' ') + '",'
           output += '"' + brain.getPath() + '",'
           output += '"' + brain.Type + '",'
           output += '"' + str(brain.review_state) + '",'
           output += '"' + str(brain.ModificationDate).replace('T', ' ').replace('-06:00', '').replace('-05:00', '') + '"\n'
            
        
        return output


    @property
    def portal(self):
        return api.portal.get()

