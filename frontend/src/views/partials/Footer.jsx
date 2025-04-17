import React from "react";

function Footer() {
    return (
        <footer style={{ backgroundColor: "#0c2340" }}>
            <div
                className="row py-5 mx-0 card card-header flex-row align-items-center text-center text-md-start"
                style={{ backgroundColor: "#0c2340" }}
            >
                <div className="col-md-5 mb-3 mb-md-0">
                    <div className="text-primary-hover text-white">
                        2024 - 2025{" "}
                        <a
                            href="https://github.com/shreya060724/"
                            className="text-reset btn-link ms-2 me-2"
                            target="_blank"
                        >
                            Shreya
                        </a>
                        | All rights reserved
                    </div>
                </div>

                <div className="col-md-3 mb-3 mb-md-0">
                    <h1 style={{ color: "#87afd6", fontWeight: "bold" }}>✒️ PostMate</h1>
                </div>

                <div className="col-md-4">
                    <ul className="nav text-primary-hover justify-content-center justify-content-md-end">
                        <li className="nav-item">
                            <a
                                className="nav-link text-white px-2 fs-5"
                                href="https://github.com/shreya060724/"
                            >
                                <i className="fab fa-facebook-square" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link text-white px-2 fs-5"
                                href="https://github.com/shreya060724/"
                            >
                                <i className="fab fa-twitter-square" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link text-white px-2 fs-5"
                                href="https://github.com/shreya060724/"
                            >
                                <i className="fab fa-youtube-square" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
