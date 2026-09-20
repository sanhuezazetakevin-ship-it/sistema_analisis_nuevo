import numpy as np


def cosine_similarity(
    embedding_a: np.ndarray,
    embedding_b: np.ndarray
) -> float:

    norm_a = np.linalg.norm(embedding_a)
    norm_b = np.linalg.norm(embedding_b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    similarity = np.dot(
        embedding_a,
        embedding_b
    ) / (norm_a * norm_b)

    return float(similarity)


def cosine_distance(
    embedding_a: np.ndarray,
    embedding_b: np.ndarray
) -> float:

    similarity = cosine_similarity(
        embedding_a,
        embedding_b
    )

    return float(1.0 - similarity)


def is_match(
    similarity: float,
    threshold: float = 0.50
) -> bool:

    return similarity >= threshold