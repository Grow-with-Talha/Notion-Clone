"use client";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toolbar from "@/components/toolbar";

interface DocumentIdPageProps {
  params: {
    documentid: Id<"documents">
  }
}


const DocumentIdPage = ({ params } : DocumentIdPageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentid
  })

  if(document === undefined) {
    return (<p>Loading...</p>)
  }
  if(document === null) {
    return (<div>Not Found</div>)
  }
  
  return (
    <div className="pb-40">
      <div  className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mt-10">
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default DocumentIdPage
