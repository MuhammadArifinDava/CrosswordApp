
export function getPostImageUrl(post) {
  if (post?.image) {
    if (post.image.startsWith("http")) return post.image;
    
    let base = import.meta.env.VITE_API_URL;
    if (!base) {
      if (window.location.hostname.includes("herokuapp.com")) {
        base = "https://minimalism-a93d11758d8d.herokuapp.com";
      } else {
        base = "http://localhost:5001";
      }
    }
    
    return `${base}${post.image}`;
  }
  return `https://picsum.photos/seed/${post?._id}/800/600`;
}

export function getUserAvatarUrl(user) {
  if (user?.avatarPath) {
    if (user.avatarPath.startsWith("http")) return user.avatarPath;
    
    let base = import.meta.env.VITE_API_URL;
    if (!base) {
      if (window.location.hostname.includes("herokuapp.com")) {
        base = "https://minimalism-a93d11758d8d.herokuapp.com";
      } else {
        base = "http://localhost:5001";
      }
    }

    return `${base}${user.avatarPath}`;
  }
  return null;
}
