"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw, Trash2 } from "lucide-react"
import { ChatWelcome } from "./chat-welcome"
import { ChatMessage, type Message } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ChatContextPanel, type ChatSession, type Document } from "./chat-context-panel"


const API_URL = process.env.NEXT_PUBLIC_API_URL



async function ragQuery(
  question: string,
  documentId: string
): Promise<{ answer: string; sourceChunks: string[] }> {


  const response = await fetch(
    `${API_URL}/api/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
        documentId,
      }),
    }
  )


  if (!response.ok) {
    throw new Error("Error al consultar el documento")
  }


  const data = await response.json()


  return {
    answer: data.answer,
    sourceChunks: data.sourceChunks ?? [],
  }

}





function generateId() {

  return Math.random()
    .toString(36)
    .slice(2, 10)

}




export function ChatWindow() {


  const [messages, setMessages] = useState<Message[]>([])

  const [documents, setDocuments] = useState<Document[]>([])

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)


  const bottomRef = useRef<HTMLDivElement>(null)




  // Obtener documentos del backend

  useEffect(() => {


    const loadDocuments = async () => {


      try {


        const response = await fetch(
          `${API_URL}/api/documents`
        )


        if (!response.ok) {
          throw new Error("Error cargando documentos")
        }


        const data = await response.json()


        setDocuments(data)



      } catch (error) {


        console.error(
          "Error documentos:",
          error
        )


      }


    }



    loadDocuments()



  }, [])






  // Scroll automático

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })

  }, [messages])






  const selectedDocName =
    documents.find(
      (doc) => doc.id === selectedDocId
    )?.name






  const handleSend = async (text: string) => {


    if (!selectedDocId || isLoading) return



    const userMsg: Message = {

      id: generateId(),

      role: "user",

      content: text,

      timestamp: new Date(),

    }





    const streamingMsg: Message = {


      id: generateId(),

      role: "assistant",

      content: "",

      timestamp: new Date(),

      isStreaming: true,


    }






    setMessages(prev => [

      ...prev,

      userMsg,

      streamingMsg,

    ])




    setIsLoading(true)




    try {


      const {
        answer,
        sourceChunks

      } = await ragQuery(
        text,
        selectedDocId
      )





      setMessages(prev =>

        prev.map(message =>

          message.id === streamingMsg.id

          ?

          {

            ...message,

            content: answer,

            sourceChunks,

            isStreaming:false,

          }

          :

          message

        )

      )





    } catch(error){



      setMessages(prev =>


        prev.map(message =>


          message.id === streamingMsg.id

          ?

          {

            ...message,

            content:
              "Ocurrió un error al consultar el documento.",

            isStreaming:false,


          }

          :

          message


        )


      )


    } finally {


      setIsLoading(false)


    }


  }







  const handleRegenerateLastAnswer = () => {


    const lastUser =

      [...messages]
      .reverse()
      .find(
        message =>
          message.role === "user"
      )



    if(lastUser){

      setMessages(prev =>
        prev.slice(0,-1)
      )


      handleSend(
        lastUser.content
      )

    }


  }







  const handleNewChat = () => {


    setMessages([])

    setActiveSessionId(null)


  }








  const handleSelectSession = (
    session: ChatSession
  ) => {


    setActiveSessionId(
      session.id
    )


    setMessages([])


  }







  const handleSelectDoc = (
    id:string
  ) => {


    setSelectedDocId(id)

    setMessages([])


  }






  const hasMessages =
    messages.length > 0





  const lastIsAssistant =

    messages.at(-1)?.role === "assistant"
    &&
    !messages.at(-1)?.isStreaming






  return (

    <div className="flex flex-1 min-h-0 overflow-hidden">


      <div className="flex flex-col flex-1 min-w-0">



        <div className="
          flex
          items-center
          justify-between
          px-6
          py-3.5
          border-b
          border-[#e8eaed]
          bg-white
        ">


          <div>

            <h1 className="
              text-base
              font-bold
              text-[#2F3A55]
            ">
              Chat académico
            </h1>



            {

            selectedDocName
            ?

            <p className=" text-xs text-[#5C6B8A]">Consultando:
              <span className="font-medium text-[#2F3A55]">
                {selectedDocName}
              </span>
            </p>
            :
            <p className="text-xs text-[#5C6B8A]/70">Selecciona un documento para comenzar</p>
            }

          </div>
          {hasMessages && (

          <div className="flex gap-2">
            <button
                onClick={handleRegenerateLastAnswer}
                disabled={!lastIsAssistant || isLoading}
                className=" flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border">
                <RefreshCw className="w-3.5 h-3.5"/>
                Regenerar
            </button>

            <button onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border" >
              <Trash2 className="w-3.5 h-3.5"/>
              Limpiar
            </button>
          </div>
          )}

        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {!hasMessages ?
          (
          <ChatWelcome
            documentName={selectedDocName}
            onPrompt={(text)=>{
              if(selectedDocId)
                handleSend(text)
            }}

          />) 
          :(

          messages.map(
            msg=> <ChatMessage
              key={msg.id}
              message={msg}
            />
          ))}


        <div ref={bottomRef}/>

        </div>

        <div className="border-t bg-white">
          <ChatInput 
            onSend={handleSend}
            disabled={!selectedDocId}
            isLoading={isLoading}
          />
        </div>
      </div>

      <ChatContextPanel
        documents={documents}
        selectedDocId={selectedDocId}
        onSelectDoc={handleSelectDoc}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        activeSessionId={activeSessionId}
      />

    </div>

  )

}