import * as chai from 'chai';
import chaiHttp from 'chai-http';
import * as index from '../index.mjs'; 
import mongoose from 'mongoose';
import Blog from '../model/Blog.mjs';

const { expect } = chai;
chai.use(chaiHttp);

describe("Blog API", function () {
  before(async function () {
    await mongoose.connect("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async function () {
    await Blog.deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  describe("GET /", function () {
    it("should fetch the list of blogs", function (done) {
      chai
        .request(index)
        .get("/api/blogs/")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.blogList).to.be.an("array");
          done();
        });
    });
  });

  describe("POST /add", function () {
    it("should add a new blog", function (done) {
      chai
        .request(index)
        .post("/api/blogs/add")
        .send({
          title: "Test Blog",
          description: "This is a test blog.",
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.newlyCreateBlog).to.have.property("title").eql("Test Blog");
          expect(res.body.newlyCreateBlog).to.have.property("description").eql("This is a test blog.");
          done();
        });
    });
  });

  describe("PUT /update/:id", function () {
    it("should update an existing blog", async function () {
      const blog = await Blog.create({
        title: "Old Title",
        description: "Old Description",
      });

      chai
        .request(index)
        .put(`/api/blogs/update/${blog._id}`)
        .send({
          title: "Updated Title",
          description: "Updated Description",
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.currentBlogToUpdate).to.have.property("title").eql("Updated Title");
          expect(res.body.currentBlogToUpdate).to.have.property("description").eql("Updated Description");
          done();
        });
    });
  });

  describe("DELETE /delete/:id", function () {
    it("should delete an existing blog", async function () {
      const blog = await Blog.create({
        title: "Blog to be deleted",
        description: "This blog will be deleted.",
      });

      chai
        .request(index)
        .delete(`/api/blogs/delete/${blog._id}`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.eql("Successfully Deleted");
          done();
        });
    });
  });
});
