import streamlit as st
import numpy as np
import tensorflow as tf
from PIL import Image
from pathlib import Path
import os

# ------------------------------------------------------------
# Configuration de la page
# ------------------------------------------------------------
st.set_page_config(page_title="Classificateur de Maisons", page_icon="🏠")

# ------------------------------------------------------------
# Mise en cache du modèle (chargé une seule fois)
# ------------------------------------------------------------
@st.cache_resource
def load_model(model_path):
    """Charge le modèle Keras avec gestion d'erreur."""
    try:
        model = tf.keras.models.load_model(model_path)
        return model
    except Exception as e:
        st.error(f"❌ Erreur lors du chargement du modèle : {e}")
        return None

# ------------------------------------------------------------
# Définition du chemin du modèle (modifiable facilement)
# ------------------------------------------------------------
DEFAULT_MODEL_PATH = Path(r"C:\Users\MSI\Desktop\projet\house_classifier_final.keras")
MODEL_PATH = os.getenv("HOUSE_MODEL_PATH", DEFAULT_MODEL_PATH)

model = load_model(MODEL_PATH)

# ------------------------------------------------------------
# Classes et paramètres d'entrée
# ------------------------------------------------------------
class_names = ['Luxury', 'Normal', 'Old']
IMG_SIZE = (224, 224)

# ------------------------------------------------------------
# Titre et description
# ------------------------------------------------------------
st.title("🏠 Classificateur de Maisons")
st.markdown("""
Cette application utilise un réseau de neurones convolutifs pour classer les photos de maisons en trois catégories :
- **Luxury** (maison de luxe)
- **Normal** (maison standard)
- **Old** (maison ancienne)

👉 **Uploadez une image** (JPG, JPEG, PNG) pour obtenir la prédiction.
""")

if model is None:
    st.stop()

# ------------------------------------------------------------
# Upload du fichier
# ------------------------------------------------------------
uploaded = st.file_uploader("Choisir une image", type=["jpg", "jpeg", "png"])

if uploaded is not None:
    col1, col2 = st.columns(2)

    with col1:
        try:
            img = Image.open(uploaded).convert("RGB")
            st.image(img, caption="Image originale", use_column_width=True)
        except Exception as e:
            st.error(f"Impossible d'ouvrir l'image : {e}")
            st.stop()

    with col2:
        # Prétraitement
        img_resized = img.resize(IMG_SIZE, Image.Resampling.LANCZOS)
        img_array = np.array(img_resized, dtype=np.float32) / 255.0
        img_batch = np.expand_dims(img_array, axis=0)

        with st.spinner("Analyse en cours..."):
            predictions = model.predict(img_batch)[0]

        best_idx = int(np.argmax(predictions))
        best_cls = class_names[best_idx]
        confidence = float(predictions[best_idx]) * 100

        # ----------------------------------------------------
        # Résultat principal
        # ----------------------------------------------------
        st.subheader("📊 Résultat de la classification")
        if best_cls == "Luxury":
            st.success(f"✅ **{best_cls}** — {confidence:.1f}% de confiance")
        elif best_cls == "Normal":
            st.info(f"🏠 **{best_cls}** — {confidence:.1f}% de confiance")
        else:
            st.warning(f"🏚️ **{best_cls}** — {confidence:.1f}% de confiance")

        # Barres de probabilités
        st.subheader("📈 Probabilités par classe")
        for i, cls in enumerate(class_names):
            prob = float(predictions[i])
            st.progress(prob, text=f"{cls} : {prob*100:.1f}%")

    # --------------------------------------------------------
    # Recommandations spécifiques selon la classe
    # --------------------------------------------------------
    if best_cls == "Luxury":
        st.balloons()  # Effet de fête
        st.markdown("---")
        st.success("🌟 Félicitations ! Cette maison a un fort potentiel haut de gamme.")
        with st.expander("💎 Conseils pour une maison de luxe"):
            st.markdown("""
            - **Mettre en valeur les espaces extérieurs** (terrasse, vue)
            - **Ajouter des équipements connectés** (domotique, alarme)
            - **Soigner l’éclairage** (LED, lustres design)
            - **Estimation marché** : souvent +20% par rapport au secteur
            """)

    elif best_cls == "Normal":
        st.markdown("---")
        st.info("🏡 Maison de type standard – bon potentiel d’amélioration.")
        with st.expander("🔧 Idées pour valoriser cette maison"):
            st.markdown("""
            - **Rafraîchir les peintures** (effet propre et moderne)
            - **Améliorer l’isolation** (combles, fenêtres)
            - **Petits extérieurs bien entretenus** (jardin, façade)
            - **Rénover la cuisine ou salle de bain** à moindre coût
            """)

    elif best_cls == "Old":
        st.markdown("---")
        st.error("""
        ## 🚨 ALERTE — Maison Ancienne Détectée !
        Cette maison a été classifiée comme **ancienne**. Une attention particulière est recommandée.
        """)
        col_a, col_b, col_c = st.columns(3)
        with col_a:
            st.warning("🔧 **Inspection structurelle** recommandée")
        with col_b:
            st.warning("⚡ **Mise aux normes** électrique à vérifier")
        with col_c:
            st.warning("💧 **Plomberie** potentiellement vétuste")

        with st.expander("📋 Voir le rapport complet d'alerte"):
            st.markdown(f"""
### Rapport d'Analyse

| Champ            | Détail                          |
|------------------|---------------------------------|
| **Classe**       | 🏚️ Old (Ancienne)               |
| **Confiance**    | {confidence:.1f}%               |
| **Statut**       | ⚠️ Nécessite une évaluation     |

### Actions recommandées
1. **Inspection structurelle** — Vérifier fondations, murs porteurs, toiture
2. **Bilan électrique** — Mise aux normes NF C 15-100
3. **Diagnostic plomberie** — Remplacement tuyaux plomb/fonte
4. **Évaluation thermique** — Isolation et fenêtres
5. **Consultation expert** — Faire appel à un professionnel agréé

> ⚠️ Ce diagnostic est basé sur l'analyse visuelle de l'image.  
> Une inspection physique par un professionnel reste indispensable.
            """)

  
else:
    st.info("👈 Veuillez uploader une image pour commencer l'analyse.")

# ------------------------------------------------------------
# Pied de page
# ------------------------------------------------------------
st.markdown("---")
st.caption("Application développée avec Streamlit & TensorFlow – Classification de maisons")