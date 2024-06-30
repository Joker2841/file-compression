#include "huffman.h"
#include "httplib.h"
#include <fstream>
#include <iostream>

using namespace httplib;

void compressFile(const std::string& inputPath, const std::string& outputPath) {
    std::ifstream inputFile(inputPath, std::ios::binary);
    std::ostringstream oss;
    oss << inputFile.rdbuf();
    std::string text = oss.str();

    HuffmanCoding hc;
    std::string compressed = hc.compress(text);

    std::ofstream outputFile(outputPath, std::ios::binary);
    outputFile << compressed;
}

int main() {
    Server svr;

    svr.Post("/compress", [](const Request& req, Response& res) {
        auto file = req.get_file_value("file");
        std::string inputPath = file.filename;
        std::string outputPath = "compressed.bin";

        std::ofstream inputFile(inputPath, std::ios::binary);
        inputFile << file.content;
        inputFile.close();

        compressFile(inputPath, outputPath);

        std::ifstream outputFile(outputPath, std::ios::binary);
        std::ostringstream oss;
        oss << outputFile.rdbuf();
        std::string compressedContent = oss.str();

        res.set_content(compressedContent, "application/octet-stream");
    });

    std::cout << "Server started at http://localhost:8080\n";
    svr.listen("localhost", 8080);

    return 0;
}
