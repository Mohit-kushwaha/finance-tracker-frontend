"use client";

import { Spin } from "antd";

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-64">
            <Spin size="large" />
        </div>
    );
}
