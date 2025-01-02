import React from 'react';
import axios from 'axios';
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
import Project from './project';
import { notFound } from 'next/navigation';

export default async function AdminPage({params}) {
  let project;
  try {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/get`);
  if (response.data.success) {
    project = response.data.data;
  }
  } catch (e) {
    
  }
  const slug = params.slug

  const renderContent = () => {
    if (!slug) {
        <p>Loading...</p>; 
        context.customToast({success:false, message:'Something went wrong'});
    }

  const checkProject = (name) => {
    const Name = decodeURIComponent(name);
    if (project && project.length > 0) {
    const Project = project.find((project) => project.Title === Name);
      return Project;
    }else{
      return false;
    }
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
    if(checkProject(slug[1])){
      const project = checkProject(slug[1]);
      return <Project project={project} />;
    }else{
        return notFound(); 
    }
  }
    
  };

  return (
    <div>
        {renderContent()}
    </div>
  );
}
