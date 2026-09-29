"use server";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

//DBからブックマークを全部取得
export async function getBookmarks(){
    const bookmarks = await prisma.bookmark.findMany({
        orderBy: {created_at: "desc"},
    });

    //BigIntのIDを文字列に変換してフロントへ返す
    return bookmarks.map((b) => ({
        id:b.id.toString(),
        url:b.url || '',
        title:b.title || b.url || '',
    }));
}

//DBにブックマークを追加
export async function addBookmarkAction(url:string){
    let title = url;
    try{
        title = new URL(url).hostname;
    }catch{
        title = url;
    }

    await prisma.bookmark.create({
        data:{
            url,
            title,
            image:"...",
        },
    });

    revalidatePath('/');
}

//DBからブックマークを削除
export async function deleteBookmarkAction(id:string){
    await prisma.bookmark.delete({
        where:{
            id:BigInt(id),
        },
    });

    revalidatePath('/');
}
