// script.js — shared by all pages

// Utility functions
function getBlogs() {
  return JSON.parse(localStorage.getItem("blogs") || "[]");
}

function createBlogCard(blog, index) {
  return `
    <div class="col">
      <div class="card custom-card h-100 shadow-lg">
        <div class="card-body">
          <h5 class="card-title fs-3 fw-bold">${blog.title}</h5>
          <p class="card-text" style="white-space: pre-line;">${blog.content.slice(0, 200)}...</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <a href="blog.html?id=${index}" class="btn btn-info">Read More</a>
        </div>
      </div>
    </div>`;
}


// Load blogs on homepage
if (document.getElementById("blogList")) {
  const blogList = document.getElementById("blogList");
  const noBlogsMsg = document.getElementById("noBlogs");
  const blogs = getBlogs();

  if (blogs.length > 0) {
    noBlogsMsg.style.display = "none";
    blogs.forEach((blog, index) => {
      blogList.innerHTML += createBlogCard(blog, index);
    });
  }
}

// Create new blog page //
// Save blog from create.html form
if (document.getElementById("createBlogForm")) {
  const form = document.getElementById("createBlogForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = form.elements["titleBlog"].value.trim();
    const content = form.elements["contentBlog"].value.trim();

    if (!title || !content) {
      alert("Both fields are required.");
      return;
    }

    const newBlog = {
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    blogs.push(newBlog);
    localStorage.setItem("blogs", JSON.stringify(blogs));

    alert("Blog created successfully!");
    window.location.href = "index.html"; // Redirect to homepage
  });
}



// Store new blog
function saveBlog(title, content) {
  const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
  const newBlog = {
    id: Date.now(), // unique id using timestamp
    title: title,
    content: content
  };
  blogs.push(newBlog);
  localStorage.setItem("blogs", JSON.stringify(blogs));
}

// Load blogs for manage.html
function loadBlogs() {
  const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
  const container = document.getElementById("blogsContainer");

  if (!container) return;

  if (blogs.length === 0) {
    container.innerHTML = `
      <h2 class="display-6 fw-bold">No blogs found. 
        <a href="create.html" class="text-warning">Write new blog?</a>
      </h2>
    `;
    return;
  }

  let output = '<div class="row row-cols-1 row-cols-md-3 g-4">';
  blogs.forEach(blog => {
    output += `
      <div class="col">
        <div class="card text-bg-secondary border-info h-100 shadow-lg">
          <div class="card-body">
            <h5 class="card-title fs-3 fw-bold">${blog.title}</h5>
            <p class="card-text">${blog.content.slice(0, 200)}...</p>
          </div>
          <div class="d-flex gap-2 px-3 pb-3">
            <a href="update.html?id=${blog.id}" class="btn btn-warning">Update</a>
            <button class="btn btn-danger" onclick="deleteBlog(${blog.id})">Delete</button>
            <a href="blog.html?id=${blog.id}" class="btn btn-info">View</a>
          </div>
        </div>
      </div>
    `;
  });
  output += '</div>';
  container.innerHTML = output;
}

// Delete blog by ID
function deleteBlog(id) {
  let blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
  blogs = blogs.filter(blog => blog.id !== id);
  localStorage.setItem("blogs", JSON.stringify(blogs));
  loadBlogs(); // Refresh list after deletion
}

// Handle blog form submission
const createForm = document.getElementById("createForm");
if (createForm) {
  createForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("titleBlog").value.trim();
    const content = document.getElementById("contentBlog").value.trim();
    if (!title || !content) {
      alert("Both title and content are required!");
      return;
    }
    saveBlog(title, content);
    alert("Blog created successfully!");
    window.location.href = "manage.html";
  });
}

// Load blogs when on manage.html
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("manage.html")) {
    loadBlogs();
  }
});
