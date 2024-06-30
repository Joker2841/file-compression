#include "huffman.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <bitset>
#include <queue>

void HuffmanCoding::buildFrequencyTable(const std::string& data) {
    frequencyTable.clear();
    for (char ch : data) {
        frequencyTable[ch]++;
    }
}

void HuffmanCoding::buildHuffmanTree() {
    std::priority_queue<Node*, std::vector<Node*>, compare> minHeap;

    for (auto pair : frequencyTable) {
        minHeap.push(new Node(pair.first, pair.second));
    }

    while (minHeap.size() != 1) {
        Node* left = minHeap.top();
        minHeap.pop();
        Node* right = minHeap.top();
        minHeap.pop();

        Node* sum = new Node('\0', left->freq + right->freq);
        sum->left = left;
        sum->right = right;
        minHeap.push(sum);
    }

    root = minHeap.top();
    generateCodes(root, "");
}

void HuffmanCoding::generateCodes(Node* root, const std::string& str) {
    if (!root) return;

    if (root->ch != '\0') {
        huffmanCodes[root->ch] = str;
        reverseHuffmanCodes[str] = root->ch;
    }

    generateCodes(root->left, str + "0");
    generateCodes(root->right, str + "1");
}

std::string HuffmanCoding::compress(const std::string& data) {
    buildFrequencyTable(data);
    buildHuffmanTree();

    std::string encodedString;
    for (char ch : data) {
        encodedString += huffmanCodes[ch];
    }
    return encodedString;
}

std::string HuffmanCoding::decompress(const std::string& encodedData) {
    std::string decodedString;
    std::string currentCode;
    for (char bit : encodedData) {
        currentCode += bit;
        if (reverseHuffmanCodes.find(currentCode) != reverseHuffmanCodes.end()) {
            decodedString += reverseHuffmanCodes[currentCode];
            currentCode = "";
        }
    }
    return decodedString;
}
