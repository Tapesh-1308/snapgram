import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./confg";

export async function createUserAccount(user) {
    try {
        const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log("createUserAccount :: error", error.message);
        return error;
    }
}

export async function saveUserToDB(user) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.log("saveUserToDB :: ", error.message);
    }
}

export async function signInAccount(user) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log("signInAccount :: ", error.message);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log("error :: getCurrAccount :: ", error.message);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log("Error :: signOutAccount :: ", error.message);
    }
}

export async function createPost(post) {
    try {
        // Upload image
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }
        // Convert tags to array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // save post to database
        const newPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, ID.unique(), {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags
        });

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;

    } catch (error) {
        console.log("Error :: createPost :: ", error.message);
    }
}

export async function uploadFile(file) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log("Error :: uploadFile :: ", error.message);
    }
}

export function getFilePreview(fileId) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        );

        return fileUrl;
    } catch (error) {
        console.log("Error :: getFilePreview :: ", error.message);
    }
}

export async function deleteFile(fileId) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: "ok" };
    } catch (error) {
        console.log("Error :: deleteFile :: ", error.message);
    }
}

export async function getRecentPosts({pageParam}) {
    
    const queries = [Query.orderDesc('$createdAt'), Query.limit(5)];

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, queries);

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log("Error :: getRecentPosts :: ", error.message);
    }
}

export async function getUserPosts(userId) {
    if (!userId) return;
  
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log("Error :: getUserPosts :: ", error.message);;
    }
  }
  

export async function likePost(postId, likesArray) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId,
            { likes: likesArray }
        )

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log("Error :: likePost :: ", error.message);
    }
}

export async function savePost(postId, userId) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log("Error :: savePost :: ", error.message);
    }
}

export async function deleteSavedPost(savedRecordId) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )

        if (!statusCode) throw Error;

        return statusCode;
    } catch (error) {
        console.log("Error :: deleteSavedPost :: ", error.message);
    }
}

export async function getPostById(postId) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        )

        return post;
    } catch (error) {
        console.log("Error :: getPostById :: ", error.message);
    }
}

export async function updatePost(post) {
    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        }

        if(hasFileToUpdate) {

            // Upload image
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;
    
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = {...image, imageId: uploadedFile.$id, imageUrl: fileUrl}
        }

        // Convert tags to array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // save post to database
        const updatedPost = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, post.postId, {
            creator: post.userId,
            caption: post.caption,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
            tags: tags
        });

        if (!updatedPost) {
            if(hasFileToUpdate)
                await deleteFile(image.imageId);
            throw Error;
        }

        if(hasFileToUpdate)
            await deleteFile(post.imageId);

        return updatedPost;

    } catch (error) {
        console.log("Error :: updatePost :: ", error.message);
    }
}

export async function deletePost(postId, imageId) {
    if(!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        )

        return { status: 'ok' };
    } catch (error) {
        console.log("Error :: deletePost :: ", error.message);
    }

}

export async function getInfinitePosts({pageParam}) {
    const queries = [Query.orderDesc('$updatedAt'), Query.limit(9)];

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            queries
        )

        if(!posts) throw Error;
        return posts;
    } catch (error) {
        console.log("Error :: getInfinitePosts :: ", error.message);
    }
}

export async function searchPosts(searchTerm) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log("Error :: searchPosts :: ", error.message);
    }
}

export async function getUsers(limit) {
    const queries = [Query.orderDesc("$createdAt")];
    if(limit)
        queries.push(Query.limit(limit));

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            queries
        );

        if(!users) throw Error;
        return users;
    } catch (error) {
        console.log("Error :: getUser :: ", error.message);
    }
}

export async function getUserById(userId) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId
        )

        if(!user) throw Error;

        return user;
    } catch (error) {
        console.log("Error :: getUserById :: ", error.message);
    }
}

export async function updateUser(user) {
    const hasFileToUpdate = user.file.length > 0;

    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        }

        if(hasFileToUpdate) {

            // Upload image
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) throw Error;
    
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = {...image, imageId: uploadedFile.$id, imageUrl: fileUrl}
        }

        // save post to database
        const updatedUser = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, user.userId, {
            name: user.name,
            bio: user.bio,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
        });

        if (!updatedUser) {
            if(hasFileToUpdate)
                await deleteFile(image.imageId);
            throw Error;
        }
        if(user.imageId && hasFileToUpdate)
            await deleteFile(user.imageId);
        return updatedUser;
    } catch (error) {
        console.log("Error :: updateUser :: ", error.message);
    }
}

export async function followingUser(userId, followingsArray) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
            { followings: followingsArray }
        )

        if (!updatedUser) throw Error;

        return updatedUser;
    } catch (error) {
        console.log("Error :: followingUser :: ", error.message);
    }
}

export async function followedUser(userId, followersArray) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
            {followers: followersArray }
        )

        if (!updatedUser) throw Error;

        return updatedUser;
    } catch (error) {
        console.log("Error :: followedUser :: ", error.message);
    }
}