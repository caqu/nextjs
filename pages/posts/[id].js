import { promises as fs } from 'fs'
import path from 'path'

// posts will be populated at build time by getStaticProps()
function Blog({ posts, id }) {
    console.log("posts", posts);
    console.log("id", id);
    const post = posts.find(post => post.id === id);
    console.log("post", post);
    const content = JSON.parse(post.content);
    const { header, body } = content;
    return (
        <div>
            <ul>
                {posts.map((post) => (
                    <li>
                        <h3>{post.filename}</h3>
                    </li>
                ))}
            </ul>
            <h1>{header}</h1>
            <div>{body}</div>
        </div>
    )
}

function stripExtension(filename) {
    return filename.split(/\.json$/).join('');
}
// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get the list of posts
    // const res = await fetch('https://.../posts')
    // const posts = await res.json()

    // Get a list of posts from the local file sytem
    const postsDirectory = path.join(process.cwd(), 'posts')
    const filenames = await fs.readdir(postsDirectory)
    const posts = filenames.map((filename) => {
        return {
            // remove ".json" to get the id from the filename
            id: stripExtension(filename)
        }
    })
    // Get the paths we want to pre-render based on posts
    const paths = posts.map((post) => ({
        params: { id: post.id },
    }))
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps(context) {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const filenames = await fs.readdir(postsDirectory)

    const posts = filenames.map(async (filename) => {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')

        // Generally you would parse/transform the contents
        // For example you can transform markdown to HTML here

        return {
            filename,
            id: stripExtension(filename),
            content: fileContents,
        }
    })
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            id: context.params.id,
            posts: await Promise.all(posts),
        },
    }
}

export default Blog