"use client";
import { useEffect, useState } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getBookmarks, addBookmarkAction, deleteBookmarkAction} from "./actions";

type Bookmark = {
  id:string;
  url:string;
  title:string;
};

export default function Home() {
  const [url,setUrl] = useState("");
  const [bookmarks,setBookmarks] = useState<Bookmark[]>([]);
  const [loading,setLoading] = useState(false);

  //初回読み込み時にDBからデータを取り出す
  const loadBookmarks = async() => {
    const data = await getBookmarks();
    setBookmarks(data);
  };

  useEffect(() => {
    loadBookmarks();
  },[]);

  //ブックマーク追加
  const addBookmark = async () => {
    if(!url) return;

    let formattedUrl = url;
    if(!url.startsWith("http://") && !url.startsWith("https://")){
        formattedUrl = `https://${url}`;
    }

    setLoading(true);
    await addBookmarkAction(formattedUrl);
    await loadBookmarks();
    setUrl("");
    setLoading(false);
  };

  //ブックマーク削除
  const deleteBookmark = async (idToDelete:string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== idToDelete));
    await deleteBookmarkAction(idToDelete);
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
        <Button type="submit" disabled={loading}>
          {loading ? "追加中..." : "追加"}
        </Button>
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