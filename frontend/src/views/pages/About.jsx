import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import CoverImage from "../../assets/Cover.png";

function About() {
    return (
        <>
            <Header />

            <section style={{ backgroundColor: "#f8f9fa", padding: "4rem 0" }}>
                <div className="container">
                    {/* Title */}
                    <div className="text-center mb-5">
                        <h1 style={{ color: "#0c2340", fontWeight: "bold", fontSize: "2.5rem" }}>
                            Our Story
                        </h1>
                        <p style={{ fontSize: "1.1rem", color: "#555" }}>
                            Welcome to <span style={{ color: "#87afd6", fontWeight: "bold" }}>PostMate</span> – your creative companion in the digital world!
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="row align-items-start">
                        <div className="col-md-6">
                            <div style={{ backgroundColor: " #87afd6", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                                <p style={{ fontSize: "1.05rem", color: "black", lineHeight: "1.8" }}>
                                    At PostMate, we believe everyone has a voice worth sharing. Whether you're a passionate writer,
                                    a thoughtful blogger, or someone with unique insights – this is your platform to shine.
                                    <br /><br />
                                    🚀 Publish articles that educate and inspire. <br />
                                    📝 Blog about your experiences, hobbies, and knowledge. <br />
                                    💡 Share ideas and connect through creativity.
                                    <br /><br />
                                    We aim to nurture a vibrant community of expression and originality.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 mt-4 mt-md-0">
                            <div style={{ backgroundColor: "rgb(38, 55, 77)", padding: "2rem", borderRadius: "12px", color: " white", height: "100%" }}>
                                <h3 style={{ fontWeight: "bold", color: "#87afd6" }}>
                                    👩‍💻 Designed & Developed by Shreya
                                </h3>
                                <p style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
                                    PostMate is the brainchild of Shreya – a tech enthusiast passionate about crafting digital experiences.
                                    With a sharp eye for design and usability, Shreya created this platform to be intuitive, creative, and creator-first.
                                    <br /><br />
                                    Every element is built with purpose – so your words get the spotlight they deserve.
                                    Every element is built with purpose – so your words get the spotlight they deserve.
                                    
                                    
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image & Quote Section */}
                    <div className="row align-items-center mt-5 pt-5 border-top">
                        <div className="col-md-6 text-center mb-4 mb-md-0">
                            <img
                                src={CoverImage}
                                alt="PostMate Cover"
                                style={{ maxHeight: "350px", objectFit: "cover" }}
                            />
                        </div>
                        <div className="col-md-6">
                            <h2
                                style={{
                                    fontFamily: "'Georgia', serif",
                                    fontStyle: "italic",
                                    fontWeight: "bold",
                                    color: "#0c2340",
                                }}
                            >
                                “All good writing leaves something unexpressed.”
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default About;
