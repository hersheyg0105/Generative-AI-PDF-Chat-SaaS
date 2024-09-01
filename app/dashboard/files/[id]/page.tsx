import React from "react";

function ChatToFilePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return <div>ChatToFilePage: {id}</div>;
}

export default ChatToFilePage;
