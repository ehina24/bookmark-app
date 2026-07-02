"use client";
import { useState } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Home() {
  const [url,setUrl] = useState("");
  const [bookmarks,setBookmarks] = useState<{id:string;url:string}[]>([]);
  //ブックマーク追加
  const addBookmark = () => {
    if(!url) return;
    let formattedUrl = url;
    if(!url.startsWith("http://") && !url.startsWith("https://")){
        formattedUrl = `https://${url}`;
    }
    const newId = String(Date.now());
    setBookmarks([...bookmarks,{id:newId,url:formattedUrl}]);
    setUrl("");
  };
  //ブックマーク削除
  const deleteBookmark = (idToDelete:string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== idToDelete));
  };

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <img src="/logo.png" alt="ロゴ" />
        <h1 className="text-3xl font-bold text-blue-600">
          BOOK MARKS
        </h1>
      </div>

      <form className="flex gap-8"
            onSubmit={(e) => {e.preventDefault();addBookmark();}}>
        <Input type="text" placeholder="URLを入力"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"/>
        <Button type="submit">追加</Button>
      </form>

      <div className="mt-10 space-y-4">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="flex gap-8 items-center">
            <div className="p-4 border rounded-xl shadow-sm bg-white flex-1 min-w-0">
              <a href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                {bookmark.url}
              </a>
            </div>
            <Button
                variant="destructive"
                onClick={() => deleteBookmark(bookmark.id)}>削除
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}