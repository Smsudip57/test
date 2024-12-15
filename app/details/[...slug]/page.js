'use client';
import React, { useEffect, useState, useContext  } from 'react';
import { useRouter } from 'next/navigation';
import Webdev from './webdev';
import Appdev from './appdev';
import Microsoft365 from './microsoft';
import Windows from './windows';
import Erp from './erp';
import Networksecurity from './networksecurity';

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
      case 'customuser':
        // return <Createcustomuser />;
    }
  }else if(slug[0] === 'projects'){
    switch (slug[1]) {
      case '':
        // return <Publishnews />;
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
