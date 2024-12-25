'use client';
import React, { useEffect, useState, useContext  } from 'react';
import { useRouter } from 'next/navigation';
import Webdev from './webdev';
import Appdev from './appdev';
import Microsoft365 from './microsoft';
import Windows from './windows';
import Erp from './erp';
import Networksecurity from './networksecurity';
import Itconsulting from './itconsulting';
import Supportservice from './supportservice';
import Iot from './iot';
import Survailanence from './surveillancesystems';

import P1 from './p1';
import P2 from './p2';
import P3 from './p3';
import P4 from './p4';

export default function AdminPage({params}) {
  const router = useRouter();
  const slug = params.slug

  const renderContent = () => {
    if (!slug) {
        <p>Loading...</p>; 
        context.customToast({success:false, message:'Something went wrong'});
    }
        
  if(slug[0] === 'products'){
    switch (slug[1]) {
      case 'webdev':
        return <Webdev />;
      case 'appdev':
        return <Appdev />;
      case 'microsoft':
        return <Microsoft365 />;
      case 'windows':
        return <Windows />;
      case 'erp':
        return <Erp />;
      case 'networksecurity':
        return <Networksecurity />;
      case 'itconsulting':
        return <Itconsulting />;
      case 'surveillancesystems':
        return < Survailanence/>;
      case 'iot':
        return <Iot />;
      case 'supportservice':
        return < Supportservice/>;
    }
  }else if(slug[0] === 'projects'){
    switch (slug[1]) {
      case 'project-1':
        return <P1 />;
      case 'project-2':
        return <P2 />;
      case 'project-3':
        return <P3 />;
      case 'project-4':
        return <P4 />;
      case 'publishnews':
        // return <Publishnews />;
      case 'publishevents':
        // return <Publishevents />;
      case 'events-participants':
        // return <Publishnews />;
      case 'draft-newsletters':
        // return <DraftNewsletterList />;
      case 'members':
        // return <Members />;
      case 'registered-events':
        // return <Publishnews />;
      case 'customuser':
        // return <Createcustomuser />;
      default:
        // return <Publishnews />; 
    }
  }
    
  };

  return (
    <div>
        {renderContent()}
    </div>
  );
}
