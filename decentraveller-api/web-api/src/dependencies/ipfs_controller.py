import requests
import os

class IPFSController:
    """
    IPFS Controller
    """
    ADD_ENDPOINT = "/api/v0/add"
    PIN_ENDPOINT = "/api/v0/pin/add"
    GET_ENDPOINT = "/api/v0/cat"

    def __init__(self):
        self.ipfs_node_url = os.getenv("IPFS_NODE_URL")
        assert self.ipfs_node_url

    def add_file(self, file: bytes) -> str:
        """
        Adds a file to ipfs and returns its hash
        :param file: the file to add
        :return: the hash of the stored file
        """

        files = {
            'file': file,
        }

        r = requests.post(self.ipfs_node_url + self.ADD_ENDPOINT, files=files)
        assert r.status_code == 200
        p = r.json()
        return p['Hash']

    def pin_file(self, file_hash: str) -> None:
        """
        Pins a file to ipfs and returns its hash
        :param file_hash: the hash of the file
        """

        r = requests.post(self.ipfs_node_url + self.PIN_ENDPOINT,
                          params={"arg": file_hash})
        if not r.status_code == 200:
            raise FileNotFoundError

    def get_file(self, file_hash: str) -> bytes:
        """
        Gets a file from IPFS

        :param file_hash: the hash of the file
        :return: the file bytes
        """
        r = requests.post(self.ipfs_node_url + self.GET_ENDPOINT,
                          params={"arg": file_hash})
        if not r.status_code == 200:
            raise FileNotFoundError
        return r.content