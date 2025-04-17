import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from '../../utils/axios';
import Toast from '../../plugin/Toast';
import Moment from '../../plugin/Moment';

function Index() {

    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState([]);

    const fetchPosts = async () => {
        try {
            const response_post = await apiInstance.get('post/lists/');
            const response_category = await apiInstance.get('post/category/list/');
            setPosts(response_post.data);
            setCategory(response_category.data);
            console.log(response_post.data)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const postItems = posts?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(posts?.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);


    return (
        <div>
            <Header />

            <section className="hero-section py-3 ">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-3">Discover Amazing Content</h1>
                            <p className="lead mb-4">Explore trending articles, insightful stories, and expert perspectives on our content writing platform.</p>
                            <div className="d-flex gap-3">
                                <Link to="/register/" style={{ backgroundColor: " #87afd6" }} className="btn btn btn-lg fw-bold px-4">Start Writing</Link>
                                <Link to="/dashboard/" className="btn btn-outline-dark btn-lg px-4">Explore</Link>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-5 mt-lg-0 text-center">
                            <img src="src/assets/Cover.png" alt="PostMate" style={{ backgroundColor: 'transparent' }} />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-3 bg-light">
                <div className="container">
                    <div className="text-center mb-2">
                        <h1 className="fw-bold" style={{ color: "#1c3d5a" }}>🔎 Trending Articles 🔎</h1>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {postItems.map((post) => (
                            <div className="col-sm-6 col-lg-3" key={post?.id}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={post.image} alt="Card image" />
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <Link to={post.slug} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                {post.title}
                                            </Link>
                                        </h4>
                                        <button style={{ border: "none", background: "none" }}>
                                            <i className="fas fa-bookmark text-danger"></i>
                                        </button>
                                        <button style={{ border: "none", background: "none" }}>
                                            <i className="fas fa-thumbs-up text-primary"></i>
                                        </button>

                                        <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                            <li>
                                                <a href="#" className="text-dark text-decoration-none">
                                                    <i className="fas fa-user"></i> {post?.profile?.full_name}
                                                </a>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {Moment(post.date)}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {post.view} Views
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                    <nav className="d-flex mt-2">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold me-1 rounded" onClick={() => setCurrentPage(currentPage - 1)}>
                                    <i className="fas fa-arrow-left me-2" />
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {pageNumbers?.map((number) => (
                                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                    <button className="page-link text-dark fw-bold rounded" onClick={() => setCurrentPage(number)}>{number}</button>
                                </li>
                            ))}
                        </ul>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold ms-1 rounded" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Next
                                    <i className="fas fa-arrow-right ms-3 " />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>


            <section className="categories-section py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Explore Categories</h2>
                        <p className="text-muted">Discover content that matches your interests</p>
                    </div>

                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
                        {category.map((cat) => (
                            <div className="col" key={cat.id}>

                                <div className="category-card card h-100 border-0 shadow-sm text-center">
                                    <div className="category-img-container">
                                        <img
                                            src={cat.image}
                                            alt={cat.title}
                                            className="img-fluid rounded-top"
                                            style={{ height: "120px", width: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="card-body py-3">
                                        <h5 className="card-title mb-1 fw-bold">{cat.title}</h5>
                                        <p className="mb-0 text-muted small">{cat.post_count || '0'} Articles</p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Index;