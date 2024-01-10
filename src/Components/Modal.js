// Modal.js
import React from "react";
import PropTypes from 'prop-types';
import {  Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

export function Modal({ header, body, isOpen, onClickFunction, long , size="sm" }) {
    return (
        <Dialog open={isOpen} handler={onClickFunction} size={size}>
            <DialogHeader>{header}</DialogHeader>
            <DialogBody className={long ? long : ""}>{body}</DialogBody>
            <DialogFooter>

            </DialogFooter>
        </Dialog>
    );
}

Modal.propTypes = {
    header: PropTypes.string.isRequired,
    body: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClickFunction: PropTypes.func.isRequired,
};