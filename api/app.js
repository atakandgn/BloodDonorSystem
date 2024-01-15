// app.js
const express = require('express');
const sql = require('mysql');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const sass = require('node-sass');
const path = require('path');
require('dotenv').config({path: './config/.env'});
const app = express();
app.use(cors());
app.use(express.json())
const port = 5000;

app.use(express.static(path.join(__dirname, 'public')));


const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');

app.use(authRoutes);
app.use(hospitalRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Root endpoint
app.get('/', (req, res) => {
    // SCSS code
    // background: url(/bannertkn.png) no-repeat center center ;
    const scssCode = `
            .content-item {

                background-size: cover;
                background-position: center;
                height: 300px;
                margin: 20px auto;
                overflow: hidden;
                position: relative;
                width: 400px;
                
                &:hover {
                box-shadow: #94edff 0px 10px 50px -20px;
                transition: all 0.5s ease-out;
                duration: 0.5s;
                }
                
                .overlay {
                    border-bottom: 100px solid #99b9ff;
                    border-left: 100px solid transparent;
                    bottom: 0;
                    height: 0;
                    opacity: 0.95;
                    position: absolute;
                    right: 0;
                    text-indent: -9999px;
                    transition: all 0.5s ease-out;
                    width: 0;
                    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
                }
                &:hover .overlay {
                    border-bottom: 800px solid #99b9ff;
                    border-left: 800px solid transparent;
                    transition: all 0.5s ease-out;
                }
                .corner-overlay-content {
                    font-size: 20px;
                    font-weight: bold;
                    font-style: italic;
                    bottom: 15px;
                    color: #333;
                    position: absolute;
                    right: 15px;
                    transition: all 0.5s ease-out;
                }
                &:hover .corner-overlay-content {
                    opacity: 0;
                    transition: all 0.5s ease-out;
                }
                .overlay-content {
                    bottom: 0;
                    color: #333;
                    left: 0;
                    opacity: 0;
                    padding: 30px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transition: all 0.3s ease-out;
                    h2 {
                        font-size: 24px;
                        line-height: 1.8;
                        text-transform: uppercase;
                        text-align: center;
                        border-bottom: 1px solid #333;
                        padding: 0 0 12px;
                    }
                    p {
                        font-size: 20px;
                        line-height: 1.5;
                        margin: 0;
                        text-align: center;
                        a {
                            color: #8700d2;
                            text-decoration: underline;
                            font-weight: bold;
                            font-size: 20px;
                            &:hover{
                                color: #8c41b5;
                                transition: all 0.3s ease-out;
                            }
                        }
                    }
                }
                &:hover .overlay-content {
                    opacity: 1;
                    transition: all 0.3s ease-out;
                    transition-delay: 0.3s;
                }
            }
             .socials {
            ul {
                display: flex;
                list-style: none;
                padding: 0;
            }
                ul li {
    position: relative;
    display: block;
    color: #666;
    font-size: 30px;
    height: 60px;
    width: 60px;
    background: #171515;
    line-height: 60px;
    border-radius: 50%;
    margin: 0 15px;
    cursor: pointer;
    transition: .5s;
    display: flex;
    align-items: center;
    justify-content: center;

    .tooltip {
        position: absolute;
        bottom: 100%; 
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: #fff;
        padding: 2px 8px; 
        border-radius: 4px;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        pointer-events: none;
        z-index: 1;
        text-align: center;
        white-space: nowrap;

        &::before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            border-width: 6px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
            transform: translateX(-50%);
        }
    }

    &:hover .tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(-8px);
        }
    }

            ul li a {
                text-decoration: none;
                color: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            ul li:before {
                position: absolute;
                content: '';
                top: 0;
                left: 0;
                height: inherit;
                width: inherit;
                border-radius: 50%;
                transform: scale(.9);
                z-index: -1;
                transition: .5s;
            }
                ul li:nth-child(1):before{
                  background: #686868;
                }
                ul li:nth-child(2):before{
                  background: #2867B2;
                }
                ul li:nth-child(3):before{
                  background: #E1306C;
                }
                ul li:hover:before{
                  filter: blur(3px);
                  transform: scale(1.2);
                  /* box-shadow: 0 0 15px #d35400; */
                }
                ul li:nth-child(1):hover:before{
                  box-shadow: 0 0 15px #686868;
                }
                ul li:nth-child(2):hover:before{
                  box-shadow: 0 0 15px #2867B2;
                }
                ul li:nth-child(3):hover:before{
                  box-shadow: 0 0 15px #E1306C;
                }
                ul li:nth-child(1):hover{
                  color: #456cba;
                  box-shadow: 0 0 15px #4267B2;
                  text-shadow: 0 0 15px #4267B2;
                }
                ul li:nth-child(2):hover{
                  color: #26a4f2;
                  box-shadow: 0 0 15px #1DA1F2;
                  text-shadow: 0 0 15px #1DA1F2;
                }
                ul li:nth-child(3):hover{
                  color: #e23670;
                  box-shadow: 0 0 15px #E1306C;
                  text-shadow: 0 0 15px #E1306C;
                }
            }
    
            body {
                display: grid;
                height: 100vh;
                margin: 0;
                place-items: center;
                background: black;
            }
        `;

    // Compile SCSS to CSS
    const cssCode = sass.renderSync({
        data: scssCode
    }).css.toString();

    // HTML content
    const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssCode}</style>
                <title>Welcome to the Blood Donor System!</title>
                <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
            </head>
            <body>
                <div class="content-item">
                    <div class="overlay"></div>
                    <div class="corner-overlay-content">Info</div>
                    <div class="overlay-content">
                        <h2>Welcome to the Blood Donor System!</h2>
                        <p>Please use the <a href="/api-docs" target="_blank">/api-docs</a> endpoint to view the documentation.</p>
                    </div>
                </div>
                
                <div class="socials">
                    <ul>
                        <li>
                        <a href="https://github.com/atakandgn" target="_blank">
                           <svg width="40px" height="40px" viewBox="0 0 48 48" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" fill="#666666" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:#666666;stroke-linecap:round;stroke-linejoin:round;fill-rule:evenodd;}</style></defs><path class="cls-1" d="M24,2.5a21.5,21.5,0,0,0-6.8,41.9c1.08.2,1.47-.46,1.47-1s0-1.86,0-3.65c-6,1.3-7.24-2.88-7.24-2.88A5.7,5.7,0,0,0,9,33.68c-1.95-1.33.15-1.31.15-1.31a4.52,4.52,0,0,1,3.29,2.22c1.92,3.29,5,2.34,6.26,1.79a4.61,4.61,0,0,1,1.37-2.88c-4.78-.54-9.8-2.38-9.8-10.62a8.29,8.29,0,0,1,2.22-5.77,7.68,7.68,0,0,1,.21-5.69s1.8-.58,5.91,2.2a20.46,20.46,0,0,1,10.76,0c4.11-2.78,5.91-2.2,5.91-2.2a7.74,7.74,0,0,1,.21,5.69,8.28,8.28,0,0,1,2.21,5.77c0,8.26-5,10.07-9.81,10.61a5.12,5.12,0,0,1,1.46,4c0,2.87,0,5.19,0,5.9s.39,1.24,1.48,1A21.5,21.5,0,0,0,24,2.5"></path></g></svg>
                            <div class="tooltip">GitHub</div>
                        </a>
                        </li>
                        <li>
                        <a href="https://www.linkedin.com/in/atakandoan/" target="_blank">
                         <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50"  fill="#666666" stroke="#666666" stroke-width="0">
                            <path d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 14 11.011719 C 12.904779 11.011719 11.919219 11.339079 11.189453 11.953125 C 10.459687 12.567171 10.011719 13.484511 10.011719 14.466797 C 10.011719 16.333977 11.631285 17.789609 13.691406 17.933594 A 0.98809878 0.98809878 0 0 0 13.695312 17.935547 A 0.98809878 0.98809878 0 0 0 14 17.988281 C 16.27301 17.988281 17.988281 16.396083 17.988281 14.466797 A 0.98809878 0.98809878 0 0 0 17.986328 14.414062 C 17.884577 12.513831 16.190443 11.011719 14 11.011719 z M 14 12.988281 C 15.392231 12.988281 15.94197 13.610038 16.001953 14.492188 C 15.989803 15.348434 15.460091 16.011719 14 16.011719 C 12.614594 16.011719 11.988281 15.302225 11.988281 14.466797 C 11.988281 14.049083 12.140703 13.734298 12.460938 13.464844 C 12.78117 13.19539 13.295221 12.988281 14 12.988281 z M 11 19 A 1.0001 1.0001 0 0 0 10 20 L 10 39 A 1.0001 1.0001 0 0 0 11 40 L 17 40 A 1.0001 1.0001 0 0 0 18 39 L 18 33.134766 L 18 20 A 1.0001 1.0001 0 0 0 17 19 L 11 19 z M 20 19 A 1.0001 1.0001 0 0 0 19 20 L 19 39 A 1.0001 1.0001 0 0 0 20 40 L 26 40 A 1.0001 1.0001 0 0 0 27 39 L 27 29 C 27 28.170333 27.226394 27.345035 27.625 26.804688 C 28.023606 26.264339 28.526466 25.940057 29.482422 25.957031 C 30.468166 25.973981 30.989999 26.311669 31.384766 26.841797 C 31.779532 27.371924 32 28.166667 32 29 L 32 39 A 1.0001 1.0001 0 0 0 33 40 L 39 40 A 1.0001 1.0001 0 0 0 40 39 L 40 28.261719 C 40 25.300181 39.122788 22.95433 37.619141 21.367188 C 36.115493 19.780044 34.024172 19 31.8125 19 C 29.710483 19 28.110853 19.704889 27 20.423828 L 27 20 A 1.0001 1.0001 0 0 0 26 19 L 20 19 z M 12 21 L 16 21 L 16 33.134766 L 16 38 L 12 38 L 12 21 z M 21 21 L 25 21 L 25 22.560547 A 1.0001 1.0001 0 0 0 26.798828 23.162109 C 26.798828 23.162109 28.369194 21 31.8125 21 C 33.565828 21 35.069366 21.582581 36.167969 22.742188 C 37.266572 23.901794 38 25.688257 38 28.261719 L 38 38 L 34 38 L 34 29 C 34 27.833333 33.720468 26.627107 32.990234 25.646484 C 32.260001 24.665862 31.031834 23.983076 29.517578 23.957031 C 27.995534 23.930001 26.747519 24.626988 26.015625 25.619141 C 25.283731 26.611293 25 27.829667 25 29 L 25 38 L 21 38 L 21 21 z"></path>
                            </svg>
                             <div class="tooltip">Linkedin</div>
                            </a>
                          </li>
                        <li>
                        <a href="mailto:atakandogan.info@gmail.com">
                            <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#666666"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:#666666;stroke-miterlimit:10;}</style></defs><path class="cls-1" d="M13.39,12.15V38.54H7.06A2.56,2.56,0,0,1,4.5,36V16.82"></path><path class="cls-1" d="M34.61,12.15V38.54h6.33A2.56,2.56,0,0,0,43.5,36V16.82"></path><path class="cls-1" d="M24,31.45,43.5,17V13.4a3.94,3.94,0,0,0-6.28-3.16L24,20.06,10.78,10.24A3.94,3.94,0,0,0,4.5,13.4V17Z"></path></g></svg>
                       <div class="tooltip">E-Mail</div>
                        </a> 
                        </li>
                    </ul>
                </div>
            </body>
            </html>
        `;

    res.send(htmlResponse);
});






