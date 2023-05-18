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
            'librarian': {
                    'url': 'http://www.uwosh.edu/library/about/staff#reference',
                    'title': 'Reference Librarians',
                    'image': 'http://www.uwosh.edu/library/images/ask-a-librarian-stacked.png',
                    'id': 'reference-librarians',
                    'information': {
                        'getOfficeRoom': 'Polk 101',
                        'getFax': '',
                        'getEmail': 'infodesk@uwosh.edu',
                        'getDepartment': 'Public Services',
                        'getPosition': 'Reference Librarian',
                        'getPhoneDesk': '',
                        'getPhoneOffice': '920-424-4333',
                    }
                },
        }
        self.process()
        
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

        
    def process(self):
        org_unit = self.request.form.get('org_unit', 0)
        self._data['org_unit'] = org_unit
        org_code = self.request.form.get('org_code', '#$%^@')
        self._data['org_code'] = org_code
    
        # Handle Course Page
        cp = self.get_course_page(org_unit)
        if cp:
            self._data['coursepage_is_missing'] = 0
            self._data['coursepage'] = {
                'url':cp.getURL(),
                'description':'',
                'title':cp.Title
            }
            
            # if not cp.activated:
                # self._data['coursepage']['show_subject_resources'] = False
            # else:
                # self._data['coursepage']['show_subject_resources'] = cp.activated
            
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
            
        # Handle Subjects
        subj = self.get_subject_guide(org_code)
        if subj:
            self._data['subject_is_missing'] = 0
            self._data['subjects'].append({
                'url':subj.getURL(),
                'description':'',
                'title':subj.Title,
            })

            
            
            
    def get_subject_guide(self, org_code):
    
            
        # add new map here:  TARGET > SUBJECT_GUIDE_ID
        # Find target keyword in org_code.  
        # Example: org_code is UWOSH_0700_14W_NURSING_448_SEC091C_31421
        # Map would be NURSING > nursing
        # Example: org_code is UWOSH_0300_14W_HIST_238_SEC031C_49226
        # Map would be HIST > history
        # Example: org_code is UWOSH_0544_14W_POLI_238_SEC022C_25758
        # Map would be POLI > political-science
        subject_map = {
            'AF AM ST':'interdisciplinary',
            'ANTHRO':'social-sciences',
            'ART':'fine-arts',
            'ACCT':'business-economics',
            'BIOLOGY':'stem',
            'BUSINESS':'business-economics',
            'CHEM':'stem',
            'CHINESE':'english-foreign-languages',
            'COMM':'communication-media',
            'COMP SCI':'stem',
            'CRIM JUS':'government-law-human-services',
            'CRIM%20JUS':'government-law-human-services',
            'CRIMJUS':'government-law-human-services',
            'CRIM':'government-law-human-services',
            'ECON':'business-economics',
            'ELEM ED':'education',
            'EMBA':'business-economics',
            'ENGLISH':'english-foreign-languages',
            'ENV STDS':'sustainability',
            'FERM':'',
            'FINANCE':'business-economics',
            'FRENCH':'english-foreign-languages',
            'GEOG':'social-sciences',
            'GEOLOGY':'stem',
            'GERMAN':'english-foreign-languages',
            'HISTORY':'history-philosophy-religion',
            'HUMAN SV':'government-law-human-services',
            'INFO SYS':'business-economics',
            'INTRNTL':'interdisciplinary',
            'JAPANESE':'english-foreign-languages',
            'JOURNAL':'communication-media',
            'KINESLGY':'nursing-allied-health',
            'LITERACY':'english-foreign-languages',
            'MARKET':'business-economics',
            'MATH':'stem',
            'MED TECH':'nursing-allied-health',
            'MIL SCI':'government-law-human-services',
            'MUSIC':'fine-arts',
            'NURS':'nursing-allied-health',
            'PHIL':'history-philosophy-religion',
            'PHY ED':'education',
            'PHYS/AST':'stem',
            'POLI SCI':'social-sciences',
            'PRF CNSL':'psychology-counseling',
            'PSYCH':'psychology-counseling',
            'PUB ADM':'government-law-human-services',
            'RTF':'communication-media',
            'RELSTDS':'history-philosophy-religion',
            'SCM':'business-economics',
            'SEC ED':'education',
            'SPANISH':'english-foreign-languages',
            'SOC JUST':'interdisciplinary',
            'SOC WORK':'social-sciences',
            'SOC':'social-sciences',
            'SPEC ED':'education',
            'THEATRE':'fine-arts',
            'URB PLNG':'social-sciences',
            'WBIS':'english-foreign-languages',
            'WG STDS':'interdisciplinary',
        }
    
        id = '123_TEST'
        for k,v in subject_map.items():
            if k in org_code:
                id = v 
                break
        try:
            brains = api.content.find(portal_type='polklibrary.type.subjects.models.subject', id=id)
            return brains[0]
        except Exception as e:
            #print("ERROR: "  + str(e))
            return None

    def get_course_page(self, org_unit):
        try:
            brains = api.content.find(portal_type='polklibrary.type.coursepages.models.page', resources=org_unit)
            return brains[0]
        except Exception as e:
            #print("ERROR: "  + str(e))
            return None

        
        
        
        
        
        
        
    @property
    def portal(self):
        return api.portal.get()
        