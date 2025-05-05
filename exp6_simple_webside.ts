// File: simple-website.ts
// Simple Website with TypeScript

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  }
  
  enum UserRole {
    Admin = "admin",
    Customer = "customer",
    Guest = "guest"
  }
  
  interface BlogPost {
    id: number;
    title: string;
    content: string;
    author: User;
    publishDate: Date;
    tags: string[];
    likes: number;
    comments: Comment[];
  }
  
  interface Comment {
    id: number;
    user: User;
    content: string;
    date: Date;
  }
  
  // DOM Helper functions with TypeScript
  class DOMHelper {
    /**
     * Create an element with given attributes and children
     */
    static createElement<K extends keyof HTMLElementTagNameMap>(
      tag: K,
      attributes: Record<string, string> = {},
      ...children: (string | HTMLElement)[]
    ): HTMLElementTagNameMap[K] {
      const element = document.createElement(tag);
      
      // Set attributes
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      
      // Append children
      children.forEach(child => {
        if (typeof child === "string") {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
      
      return element;
    }
    
    /**
     * Get element by ID with type checking
     */
    static getElementById<T extends HTMLElement>(id: string): T {
      const element = document.getElementById(id) as T;
      if (!element) {
        throw new Error(`Element with ID "${id}" not found`);
      }
      return element;
    }
    
    /**
     * Add event listener with type checking
     */
    static addEventListenerTo<T extends HTMLElement, K extends keyof HTMLElementEventMap>(
      element: T,
      type: K,
      listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
    ): void {
      element.addEventListener(type, listener);
    }
  }
  
  // Data Service
  class DataService {
    private static instance: DataService | null = null;
    private users: User[] = [];
    private posts: BlogPost[] = [];
    
    private constructor() {
      this.initializeData();
    }
    
    public static getInstance(): DataService {
      if (!DataService.instance) {
        DataService.instance = new DataService();
      }
      return DataService.instance;
    }
    
    private initializeData(): void {
      // Add sample users
      this.users = [
        {
          id: 1,
          name: "Ananya Sharma",
          email: "ananya@example.com",
          role: UserRole.Admin
        },
        {
          id: 2,
          name: "Vikram Patel",
          email: "vikram@example.com",
          role: UserRole.Customer
        },
        {
          id: 3,
          name: "Priya Desai",
          email: "priya@example.com",
          role: UserRole.Customer
        }
      ];
      
      // Add sample blog posts
      this.posts = [
        {
          id: 1,
          title: "Getting Started with TypeScript",
          content: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...",
          author: this.users[0],
          publishDate: new Date("2023-01-15"),
          tags: ["typescript", "javascript", "programming"],
          likes: 24,
          comments: [
            {
              id: 1,
              user: this.users[1],
              content: "Great introduction to TypeScript!",
              date: new Date("2023-01-16")
            }
          ]
        },
        {
          id: 2,
          title: "Advanced TypeScript Features",
          content: "In this post, we'll explore some advanced TypeScript features such as...",
          author: this.users[0],
          publishDate: new Date("2023-02-05"),
          tags: ["typescript", "advanced", "programming"],
          likes: 18,
          comments: [
            {
              id: 2,
              user: this.users[2],
              content: "This helped me understand generics better. Thanks!",
              date: new Date("2023-02-06")
            },
            {
              id: 3,
              user: this.users[1],
              content: "Looking forward to more content like this!",
              date: new Date("2023-02-07")
            }
          ]
        }
      ];
    }
    
    public getAllUsers(): User[] {
      return [...this.users];
    }
    
    public getUserById(id: number): User | undefined {
      return this.users.find(user => user.id === id);
    }
    
    public getAllPosts(): BlogPost[] {
      return [...this.posts];
    }
    
    public getPostById(id: number): BlogPost | undefined {
      return this.posts.find(post => post.id === id);
    }
    
    public addComment(postId: number, userId: number, content: string): boolean {
      const post = this.getPostById(postId);
      const user = this.getUserById(userId);
      
      if (!post || !user) return false;
      
      const newComment: Comment = {
        id: this.generateCommentId(),
        user,
        content,
        date: new Date()
      };
      
      post.comments.push(newComment);
      return true;
    }
    
    public addLike(postId: number): boolean {
      const post = this.getPostById(postId);
      if (!post) return false;
      
      post.likes++;
      return true;
    }
    
    private generateCommentId(): number {
      const allComments = this.posts.flatMap(post => post.comments);
      return allComments.length > 0 
        ? Math.max(...allComments.map(comment => comment.id)) + 1
        : 1;
    }
  }
  
  // UI Components
  class BlogComponent {
    private container: HTMLElement;
    private dataService: DataService;
    private currentUser: User;
    
    constructor(containerId: string) {
      this.container = DOMHelper.getElementById<HTMLDivElement>(containerId);
      this.dataService = DataService.getInstance();
      // Set default user (in a real app, this would come from authentication)
      this.currentUser = this.dataService.getUserById(2) as User;
      
      this.render();
    }
    
    private render(): void {
      this.container.innerHTML = '';
      const posts = this.dataService.getAllPosts();
      
      // Create header
      const header = DOMHelper.createElement('header', { class: 'site-header' },
        DOMHelper.createElement('h1', {}, 'TypeScript Blog'),
        DOMHelper.createElement('p', {}, `Welcome, ${this.currentUser.name}!`)
      );
      
      // Create blog post container
      const blogContainer = DOMHelper.createElement('div', { class: 'blog-container' });
      
      // Add each blog post
      posts.forEach(post => {
        const postElement = this.createPostElement(post);
        blogContainer.appendChild(postElement);
      });
      
      // Add everything to the main container
      this.container.appendChild(header);
      this.container.appendChild(blogContainer);
    }
    
    private createPostElement(post: BlogPost): HTMLElement {
      // Create post header
      const postHeader = DOMHelper.createElement('div', { class: 'post-header' },
        DOMHelper.createElement('h2', {}, post.title),
        DOMHelper.createElement('div', { class: 'post-meta' },
          `By ${post.author.name} • ${this.formatDate(post.publishDate)}`
        )
      );
      
      // Create post content
      const postContent = DOMHelper.createElement('div', { class: 'post-content' }, 
        post.content
      );
      
      // Create tags
      const tagsElement = DOMHelper.createElement('div', { class: 'post-tags' });
      post.tags.forEach(tag => {
        const tagElement = DOMHelper.createElement('span', { class: 'tag' }, `#${tag}`);
        tagsElement.appendChild(tagElement);
      });
      
      // Create like button
      const likeButton = DOMHelper.createElement('button', 
        { class: 'like-button', 'data-post-id': post.id.toString() },
        `❤️ ${post.likes} likes`
      );
      
      DOMHelper.addEventListenerTo(likeButton, 'click', () => {
        this.handleLike(post.id);
      });
      
      // Create comments section
      const commentsSection = DOMHelper.createElement('div', { class: 'comments-section' },
        DOMHelper.createElement('h3', {}, `Comments (${post.comments.length})`)
      );
      
      // Add comments
      post.comments.forEach(comment => {
        const commentElement = DOMHelper.createElement('div', { class: 'comment' },
          DOMHelper.createElement('div', { class: 'comment-header' },
            `${comment.user.name} • ${this.formatDate(comment.date)}`
          ),
          DOMHelper.createElement('div', { class: 'comment-content' }, 
            comment.content
          )
        );
        commentsSection.appendChild(commentElement);
      });
      
      // Create comment form
      const commentForm = this.createCommentForm(post.id);
      commentsSection.appendChild(commentForm);
      
      // Assemble post
      const postElement = DOMHelper.createElement('article', { class: 'blog-post', 'data-post-id': post.id.toString() },
        postHeader,
        postContent,
        tagsElement,
        likeButton,
        commentsSection
      );
      
      return postElement;
    }
    
    private createCommentForm(postId: number): HTMLElement {
      const textarea = DOMHelper.createElement('textarea', { 
        placeholder: 'Write a comment...',
        rows: '3',
        class: 'comment-input'
      });
      
      const submitButton = DOMHelper.createElement('button', 
        { type: 'submit', class: 'comment-submit' },
        'Submit'
      );
      
      const form = DOMHelper.createElement('form', { class: 'comment-form' },
        textarea,
        submitButton
      );
      
      DOMHelper.addEventListenerTo(form, 'submit', (e) => {
        e.preventDefault();
        const content = (textarea as HTMLTextAreaElement).value.trim();
        if (content) {
          this.handleAddComment(postId, content);
          (textarea as HTMLTextAreaElement).value = '';
        }
      });
      
      return form;
    }
    
    private handleLike(postId: number): void {
      if (this.dataService.addLike(postId)) {
        this.render();
      }
    }
    
    private handleAddComment(postId: number, content: string): void {
      if (this.dataService.addComment(postId, this.currentUser.id, content)) {
        this.render();
      }
    }
    
    private formatDate(date: Date): string {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
  
  // Add styles
  function addStyles(): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      body {
        background-color: #f5f5f5;
        color: #333;
        line-height: 1.6;
      }
      
      .site-header {
        background-color: #4a154b;
        color: white;
        padding: 1.5rem;
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .site-header h1 {
        margin-bottom: 0.5rem;
      }
      
      .blog-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .blog-post {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
        padding: 1.5rem;
      }
      
      .post-header h2 {
        margin-bottom: 0.5rem;
        color: #4a154b;
      }
      
      .post-meta {
        color: #888;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
      
      .post-content {
        margin-bottom: 1.5rem;
      }
      
      .post-tags {
        margin-bottom: 1rem;
      }
      
      .tag {
        background-color: #e6e6e6;
        border-radius: 16px;
        padding: 0.25rem 0.75rem;
        margin-right: 0.5rem;
        font-size: 0.85rem;
        color: #555;
        display: inline-block;
      }
      
      .like-button {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0.5rem;
        cursor: pointer;
        margin-bottom: 1.5rem;
        transition: all 0.2s ease;
      }
      
      .like-button:hover {
        background-color: #f8f8f8;
        border-color: #ccc;
      }
      
      .comments-section {
        border-top: 1px solid #eee;
        padding-top: 1.5rem;
      }
      
      .comments-section h3 {
        margin-bottom: 1rem;
        color: #4a154b;
      }
      
      .comment {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
      }
      
      .comment-header {
        color: #888;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }
      
      .comment-form {
        margin-top: 1.5rem;
      }
      
      .comment-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        font-family: inherit;
        resize: vertical;
      }
      
      .comment-submit {
        background-color: #4a154b;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s ease;
      }
      
      .comment-submit:hover {
        background-color: #3e1240;
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // Main function to initialize the application
  function initializeApp(): void {
    // Create HTML structure
    const appContainer = DOMHelper.createElement('div', { id: 'app' });
    document.body.appendChild(appContainer);
    
    // Add styles
    addStyles();
    
    // Initialize blog component
    new BlogComponent('app');
  }
  
  // Run the app when the DOM is loaded
  document.addEventListener('DOMContentLoaded', initializeApp);
  
  /*
  HOW TO RUN THIS CODE:
  
  For Ubuntu System:
  
  1. Make sure you have Node.js and TypeScript installed:
     $ sudo apt update
     $ sudo apt install nodejs npm
     $ sudo npm install -g typescript
  
  2. Create a new project folder:
     $ mkdir typescript-blog
     $ cd typescript-blog
  
  3. Initialize a new project:
     $ npm init -y
     $ npm install --save-dev typescript webpack webpack-cli ts-loader html-webpack-plugin webpack-dev-server
  
  4. Create necessary files:
     $ touch index.html
     $ touch simple-website.ts
     $ touch webpack.config.js
     $ touch tsconfig.json
  
  5. Add the following content to index.html:
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>TypeScript Blog</title>
     </head>
     <body>
       <div id="app"></div>
     </body>
     </html>
  
  6. Add the following content to webpack.config.js:
     const path = require('path');
     const HtmlWebpackPlugin = require('html-webpack-plugin');
  
     module.exports = {
       mode: 'development',
       entry: './simple-website.ts',
       output: {
         filename: 'bundle.js',
         path: path.resolve(__dirname, 'dist')
       },
       resolve: {
         extensions: ['.ts', '.tsx', '.js']
       },
       module: {
         rules: [
           {
             test: /\.tsx?$/,
             use: 'ts-loader',
             exclude: /node_modules/
           }
         ]
       },
       plugins: [
         new HtmlWebpackPlugin({
           template: './index.html'
         })
       ],
       devServer: {
         static: path.join(__dirname, 'dist'),
         compress: true,
         port: 9000
       }
     };
  
  7. Add the following content to tsconfig.json:
     {
       "compilerOptions": {
         "target": "es6",
         "module": "es6",
         "moduleResolution": "node",
         "strict": true,
         "esModuleInterop": true,
         "skipLibCheck": true,
         "forceConsistentCasingInFileNames": true,
         "outDir": "./dist",
         "sourceMap": true
       },
       "include": ["*.ts"]
     }
  
  8. Copy the TypeScript code from above to simple-website.ts
  
  9. Add script to package.json:
     In package.json, add the following scripts:
     "scripts": {
       "build": "webpack",
       "start": "webpack serve --open"
     }
  
  10. Run the development server:
      $ npm start
  
  This will open the blog website in your default browser at http://localhost:9000
  */