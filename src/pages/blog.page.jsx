import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";

export const blogStructure ={
    title: '',
    des: '',
    content:'',
    author: {personal_info: {}},
    banner: '',
    publishedAt: ''

}

export const BlogContext = createContext({})

const BlogPage = () =>{

    let {blog_id} = useParams()

    const [blog, setBlog] = useState(blogStructure);
    const [similarBlogs, setSimilarBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [islikedByUsers, setLikedByUsers] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentLoaded, setTotalParentCommentLoaded] = useState(0);

    let {title, content,  banner, author: {personal_info: {fullname, username: author_username, profile_img}}, publishedAt} = blog;

    const fetchBlog = () =>{

        axios.post("http://localhost:4040/get-blog", {blog_id})
        .then(async({data: {blog}}) =>{
            
            blog.comments = await fetchComments({blog_id: blog._id, setParentCommentCountFun: setTotalParentCommentLoaded})
            
            setBlog(blog);

            axios.post("http://localhost:4040/search-blogs", {tag: blog.tags[0], limit: 6, eliminate_blog: blog_id})
            .then(({data})=>{
              setSimilarBlog(data.blogs)
            })
            setLoading(false);
        })
        .catch(err =>{
            console.log(err)
            setLoading(false);
        })
    }

    useEffect(() =>{

        resetStates();
       fetchBlog(); 

    }, [blog_id])

    const resetStates = () =>{
        setBlog(blogStructure);
        setSimilarBlog(null);
        setLoading(true);
        setLikedByUsers(false);
        setCommentsWrapper(false);
        setTotalParentCommentLoaded(0);
    }


    return(
       <>
       {
        loading ? <Loader />
        :
        <BlogContext.Provider value={{blog, setBlog, islikedByUsers, setLikedByUsers, commentsWrapper, setCommentsWrapper, totalParentCommentLoaded, setTotalParentCommentLoaded}}>

            <CommentsContainer />
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" />

            <div className="mt-12">
                <h2>{title}</h2>

                <div className="flex max-sm: flex-col justify-between my-8">
                    <div className="flex gap-5 items-start">
                        <img src={profile_img} className="w-12 h-12 rounded-full" />
                        <p className="capitalize">
                            {fullname}
                            <br />
                            @
                            <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
                        </p>
                    </div>
                    <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm: ml-12 max-sm: pl-5">Published on {getDay(publishedAt)}</p>
                </div>

            </div>
           
            <BlogInteraction />
            <div className="my-12 font-gelasio blog-page-content">
                {
                    content[0].blocks.map((block, i) => {
                        return <div key={i} className="my-4 md:my-8">
                            <BlogContent block={block}/>                          
                        </div>
                    })
                }
                
            </div>

            <BlogInteraction />

            {
               similarBlogs != null && similarBlogs.length ?  
               <>
                  <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>

                  {/* {
                    similarBlogs.map((blog, i)=>{
                        let {author: {personal_info}} = blog;

                        return  <>
                        <BlogPostCard  content={blog}  />
                        
                    </>
                    })
                  } */}
               </>
                : " "
            }

        </div>
        </BlogContext.Provider>
       }
       </>
    )
}
export default BlogPage;