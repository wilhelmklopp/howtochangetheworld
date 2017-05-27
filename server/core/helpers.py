from binascii import hexlify
import os


def generate_api_token():
    key = hexlify(os.urandom(30)).decode()
    dashes_key = ""
    for idx, char in enumerate(key):
        if idx % 15 == 0 and idx != len(key)-1:
            dashes_key += "-"
        else:
            dashes_key += char

    return dashes_key
