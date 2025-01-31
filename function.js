window.function = async function(api_key, vector_store_id, batch_id, limit, order, after, before, filter) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Validate Vector Store ID
    if (!vector_store_id.value) {
        return "Error: Vector Store ID is required.";
    }

    // Validate File Batch ID
    if (!batch_id.value) {
        return "Error: File Batch ID is required.";
    }

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (limit.value) queryParams.append("limit", limit.value);
    if (order.value) queryParams.append("order", order.value);
    if (after.value) queryParams.append("after", after.value);
    if (before.value) queryParams.append("before", before.value);
    if (filter.value) {
        try {
            queryParams.append("filter", JSON.stringify(JSON.parse(filter.value)));
        } catch (e) {
            return "Error: Invalid JSON format for filter.";
        }
    }

    // API endpoint URL
    const apiUrl = `https://api.openai.com/v1/vector_stores/${vector_store_id.value}/file_batches/${batch_id.value}/files?${queryParams.toString()}`;

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return the response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
