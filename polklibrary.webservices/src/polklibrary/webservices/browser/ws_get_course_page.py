from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,os

class WSView(BrowserView):

    _data = {}
    
    #@ram.cache(lambda *args: time() // (60 * 10))
    def __call__(self):
        self._data = {
            'coursepage_is_missing': 1,
            'librarian_is_missing': 1,
            'subject_is_missing': 1,
            'subjects': [],
            'coursepage': {},
            'librarian': {},
        }
        self.process()
        
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

        
    def process(self):
        org_unit = self.request.form.get('org_unit', 0)
        self._data['org_unit'] = org_unit
        org_code = self.request.form.get('org_code', '#$%^@')
    
        # Handle Course Page
        cp = self.get_course_page(org_unit)
        if cp:
            self._data['coursepage_is_missing'] = 0
            self._data['coursepage'] = {
                'url':cp.getURL(),
                'description':'',
                'title':cp.Title,
            }
            
        # Handle Subjects
        
        
        # Handle Librarian Info
        path = os.path.split(cp.getPath())[0]
        lib = api.content.get(path=path)
        staff = api.content.get(path=lib.location)
        if staff:
            self._data['librarian_is_missing'] = 0
            self._data['librarian'] = {
                'url': staff.absolute_url(),
                'title': staff.Title(),
                'image': staff.absolute_url() + '/@@download/image/' + staff.image.filename,
                'id': staff.getId(),
                'information': {
                    'getOfficeRoom': staff.location,
                    'getFax': staff.fax,
                    'getEmail': staff.email,
                    'getDepartment': staff.department,
                    'getPosition': staff.position,
                    'getPhoneDesk': staff.phone,
                    'getPhoneOffice': staff.phone,
                }
            }
            
            
    

    def get_course_page(self, org_unit):
        try:
            brains = api.content.find(portal_type='polklibrary.type.coursepages.models.page', resources=org_unit)
            return brains[0]
        except Exception as e:
            print "ERROR: "  + str(e)
            return None

        
        
        
        
        
        
        
    @property
    def portal(self):
        return api.portal.get()
        