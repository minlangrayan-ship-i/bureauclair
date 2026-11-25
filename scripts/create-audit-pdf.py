from pathlib import Path
import json, re, html, zipfile, collections, hashlib
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, KeepTogether
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from xml.etree import ElementTree

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/audit-guide-2026-11-24'
V=json.loads((OUT/'inventaire.json').read_text(encoding='utf-8'))
R=json.loads((OUT/'audit-captures.json').read_text(encoding='utf-8'))
E=json.loads((OUT/'audit-verifications.json').read_text(encoding='utf-8')) if (OUT/'audit-verifications.json').exists() else {}
for name,file in [('UI','segoeui.ttf'),('UI-Bold','segoeuib.ttf'),('UI-Italic','segoeuii.ttf')]:
 pdfmetrics.registerFont(TTFont(name,str(Path('C:/Windows/Fonts')/file)))
pdfmetrics.registerFontFamily('UI',normal='UI',bold='UI-Bold',italic='UI-Italic',boldItalic='UI-Bold')
purple=colors.HexColor('#6755d7');ink=colors.HexColor('#24344b');mint=colors.HexColor('#e5f2ed');light=colors.HexColor('#f4f1ff')
W=499
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyFR',fontName='UI',fontSize=10,leading=15,textColor=ink,spaceAfter=7))
styles.add(ParagraphStyle(name='SmallFR',parent=styles['BodyFR'],fontSize=8,leading=11,textColor=colors.HexColor('#4d5a6d')))
styles.add(ParagraphStyle(name='TitleFR',fontName='UI-Bold',fontSize=30,leading=36,textColor=ink,spaceAfter=18))
styles.add(ParagraphStyle(name='H1FR',fontName='UI-Bold',fontSize=20,leading=25,textColor=ink,spaceAfter=13,keepWithNext=True))
styles.add(ParagraphStyle(name='H2FR',fontName='UI-Bold',fontSize=12,leading=16,textColor=purple,spaceBefore=8,spaceAfter=6,keepWithNext=True))
styles.add(ParagraphStyle(name='BulletFR',parent=styles['BodyFR'],leftIndent=14,firstLineIndent=-10,spaceAfter=5))
styles.add(ParagraphStyle(name='TOCFR',fontName='UI',fontSize=8.6,leading=11.5,leftIndent=0,firstLineIndent=0,spaceBefore=1,textColor=ink))
styles.add(ParagraphStyle(name='ListFR',parent=styles['BodyFR'],fontSize=9.4,leading=13,spaceAfter=4))
story=[]
def esc(s):return html.escape(str(s),quote=True)
def p(s,style='BodyFR'):story.append(Paragraph(s,styles[style]))
def heading(s):p(s,'H2FR')
def bullet(s):p('• '+s,'BulletFR')
def steps(items):
 for i,s in enumerate(items,1):p(f'<b>{i}.</b> {s}')
def table(headers,rows,widths=None):
 data=[[Paragraph(esc(str(c)),styles['SmallFR']) for c in headers]]+[[Paragraph(esc(str(c)),styles['SmallFR']) for c in row] for row in rows]
 t=Table(data,colWidths=widths or [W/len(headers)]*len(headers),repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),light),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),1,purple),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#dce0e8')),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
 story.append(t);story.append(Spacer(1,10))
def shot(name,caption,maxh=265):
 f=OUT/'captures'/f'{name}.png'
 if not f.exists():return
 iw,ih=ImageReader(str(f)).getSize();scale=min(W/iw,maxh/ih)
 im=Image(str(f),width=iw*scale,height=ih*scale);im.hAlign='LEFT';story.append(im);p(caption,'SmallFR')
def chapter(title,route=None):
 story.append(PageBreak());p(title,'H1FR')
 if route:p('Adresse locale : <link color="#6755d7" href="http://localhost:4175'+esc(route)+'">'+esc(route)+'</link>','SmallFR')
def markdown(body):
 for part in body.split('\n\n'):
  part=part.strip()
  if not part:continue
  if part.startswith('### '):p(esc(part[4:]),'H2FR')
  elif part.startswith('## '):p(esc(part[3:]),'H2FR')
  else:p(esc(part).replace('\n','<br/>'))

class Report(SimpleDocTemplate):
 def afterFlowable(self,f):
  if isinstance(f,Paragraph) and f.style.name=='H1FR':
   title=f.getPlainText();key='chapter-'+str(self.seq.nextf('chapter'))
   self.canv.bookmarkPage(key);self.canv.addOutlineEntry(title,key,0,False)
   self.notify('TOCEntry',(0,title,self.page,key))
def footer(c,d):
 c.saveState();c.setStrokeColor(colors.HexColor('#ddd9ed'));c.line(48,42,547,42);c.setFont('UI',8);c.setFillColor(ink)
 c.drawString(48,29,'BureauClair • Guide d’utilisation et audit • 24 novembre 2026');c.drawRightString(547,29,str(d.page));c.restoreState()

p('BUREAUCLAIR','H2FR');story.append(Spacer(1,24));p('Ce que fait le site.<br/>Ce qui manque encore.','TitleFR')
p('Guide complet, tutoriel page par page et audit de la version actuelle. Ce document peut être téléchargé, imprimé et transmis sans disposer du projet.')
shot('01-accueil','Capture réelle de l’accueil, réalisée pour cet audit dans Microsoft Edge.',maxh=270)
table(['Périmètre','État constaté'],[['Version examinée','Projet local React / TypeScript ; référence Git b519ecf ; prévisualisation optimisée sur le port 4175.'],['Contenus','17 guides, 20 prompts, 6 articles, 6 ressources externes.'],['Point majeur','Aucune fiche YouTube documentée ; une seule démonstration locale de 12 secondes.'],['Intervention','Observation et documentation. Aucun correctif apporté au code de l’application pendant cet audit.']],[110,389])
p('Les fonctionnalités constatées sont distinguées des éléments prévus, des limites assumées et des résultats qui restent à valider. Les adresses localhost de ce document fonctionnent seulement sur l’ordinateur où le serveur tourne.','SmallFR')

chapter('Sommaire et lecture rapide')
toc=TableOfContents();toc.levelStyles=[styles['TOCFR']];story.append(toc)

chapter('01 · Verdict et mode d’emploi du document')
p('<b>BureauClair est une première application fonctionnelle, mais la qualité pédagogique et la validation du studio ne suffisent pas encore à considérer l’ensemble du cahier des charges comme achevé.</b> Le nombre de contenus est atteint. Les vidéos vérifiées, les captures adaptées à chaque manipulation, la robustesse de la recherche et certains parcours restent incomplets.')
heading('Quatre statuts pour éviter les malentendus')
table(['Statut','Signification'],[['Opérationnel','L’action existe et a été observée ou testée dans le périmètre indiqué. Cela ne vaut pas validation sur tous les appareils.'],['Partiel','Le module existe, mais sa profondeur ou certains critères du cahier des charges manquent.'],['Absent','La fonction ou le contenu n’existe pas dans cette version.'],['À valider','La présence dans le code ou un test antérieur ne suffit pas à prouver la qualité attendue sur le terrain.']],[90,409])
heading('Comment utiliser ce PDF')
steps(['Lire les pages fonctionnelles pour comprendre ce qu’un visiteur peut réellement faire.','Consulter les inventaires détaillés des 17 guides, des prompts et des articles pour juger le contenu proposé.','Lire le chapitre YouTube, puis la liste des défaillances. Les recommandations ne sont pas des fonctions déjà livrées.','Rejouer les scénarios de recette à la fin du document et noter vos propres observations.'])
heading('Méthode et limites des preuves')
p('Audit du 24 novembre 2026 : lecture du cahier des charges extrait, inspection des sources, captures nouvelles dans Edge sur Windows, essais sur ordinateur et émulation mobile de 390 × 844 pixels. Les captures montrent la version locale optimisée. Aucun téléphone physique, lecteur d’écran ou utilisateur métier n’a participé à cet audit.')
p('Les résultats antérieurs présents dans docs/VERIFICATION.md servent uniquement de contexte historique. Les observations de ce PDF sont fondées sur les nouveaux fichiers audit-captures.json et audit-verifications.json. Un parcours sans erreur JavaScript et un contrôle automatisé sans anomalie ne certifient ni la sécurité ni l’accessibilité complète.')

chapter('02 · Architecture et carte complète des pages')
p('Le navigateur exécute l’application. Les guides et articles sont des fichiers intégrés au build ; les prompts et les ressources sont des listes dans le code. Il n’existe pas de serveur applicatif, de base de données, de compte utilisateur ou d’espace d’administration dans cette version.')
table(['Adresse','Ce qu’elle ouvre'],[['/','Accueil, recherche et accès par tâches.'],['/recherche?q=…','Résultats regroupés en tutoriels, prompts et articles.'],['/guides','Catalogue de tutoriels et filtres.'],['/guides/:slug','Une fiche parmi les 17 guides détaillés dans ce document.'],['/prompts','20 modèles de consignes et leur fenêtre de personnalisation.'],['/outils','Accès studio, trame TXT et annuaire.'],['/studio','Transcription locale expérimentale, édition et notes manuelles.'],['/annuaire','6 ressources externes commentées.'],['/blog','Liste des 6 articles.'],['/blog/:slug','Lecture d’un article avec sommaire et sources.'],['/confidentialite','Flux de données, téléchargements et caches.'],['/accessibilite','Engagements et limites de validation.'],['/editorial','Méthode de rédaction et d’actualisation.'],['/a-propos','Présentation du projet ; contact public non renseigné.'],['Toute adresse inconnue','Écran de récupération avec liens accueil et guides.']],[145,354])
p('Il existe 35 adresses de contenu distinctes : 12 pages principales, 17 fiches guides et 6 articles. Les variantes de filtres sont des paramètres d’URL ; elles ne constituent pas de nouvelles pages éditoriales. L’écran introuvable est un état supplémentaire.')
heading('Ce que « IA » signifie ici')
bullet('La recherche est un classement de mots-clés local ; aucun LLM ne comprend la demande.')
bullet('Les prompts préparent une consigne. Ils ne produisent aucune réponse IA dans BureauClair.')
bullet('Le studio exécute une reconnaissance vocale Whisper sur l’appareil. Il ne génère pas de synthèse et n’identifie pas les intervenants.')

chapter('03 · Navigation commune et utilisation mobile')
shot('35-mobile-menu','Menu mobile ouvert pendant le test ; le bas de l’écran comporte cinq accès rapides.',maxh=290)
steps(['Cliquer sur BureauClair pour revenir à l’accueil. Sur ordinateur, utiliser Accueil, Tutoriels, Outils, IA & prompts ou Blog.','Utiliser la loupe pour ouvrir la recherche globale. L’annuaire est accessible via Outils, le pied de page et le menu mobile.','Sur téléphone, ouvrir le bouton de menu ou utiliser la barre de navigation inférieure. Les catégories de tutoriels restent de vrais boutons.','Au clavier, utiliser Tab pour parcourir les commandes et Entrée pour activer un lien. Le lien d’évitement permet de rejoindre le contenu principal.'])
heading('Ce qui est conservé')
p('Les filtres des tutoriels et prompts figurent dans l’URL. Le bouton Précédent du navigateur peut retrouver cette URL. Les cases de progression, la lecture terminée et les saisies du studio ne sont pas sauvegardées dans un profil. Une navigation vers une autre page remet le défilement en haut.')
heading('Points à améliorer')
p('L’annuaire est moins visible sur ordinateur que les cinq grandes rubriques. La barre inférieure ne donne pas directement accès au studio. Les captures mobiles ne montrent aucun débordement horizontal, mais le studio demande un long défilement avant d’atteindre le résultat. La lecture, le zoom, les gestes et le clavier virtuel doivent encore être testés sur de vrais téléphones.')

chapter('Complément · Repères sur téléphone')
mobile_images=[]
for name in ['31-mobile-accueil','33-mobile-studio']:
 f=OUT/'captures'/f'{name}.png';iw,ih=ImageReader(str(f)).getSize();mobile_images.append(Image(str(f),width=iw*330/ih,height=330))
pair=Table([mobile_images],colWidths=[W/2,W/2]);pair.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('ALIGN',(0,0),(-1,-1),'CENTER')]))
story.append(pair)
p('À gauche : accueil. À droite : studio avant import. Captures de la zone visible en émulation 390 × 844 pixels.','SmallFR')
heading('Ce que ces captures montrent')
p('Les colonnes s’empilent, les titres restent visibles et la barre de navigation se place en bas. Aucun débordement horizontal n’a été relevé dans les 35 routes sur cette largeur. Sur l’accueil, l’illustration vient après les actions ; la recherche est plus basse. Dans le studio, la préparation du fichier précède le panneau de résultat : un défilement est nécessaire pour le rejoindre.')
heading('Ce qu’elles ne prouvent pas')
p('Le calcul audio de la vue mobile utilise toujours cet ordinateur Windows. Ce n’est pas un benchmark de téléphone. Les captures ne valident pas le clavier virtuel, les gestes avec un lecteur d’écran, la mémoire disponible, la chauffe ou l’autonomie. Une recette Android et iPhone physiques reste indispensable avant une promesse large d’usage mobile.')

chapter('04 · Accueil : comprendre et entrer dans le site','/')
shot('01-accueil','Accueil sur ordinateur : promesse, deux actions, illustration et champ de recherche.')
steps(['Choisir « Trouver une solution » pour ouvrir tous les tutoriels, ou « Découvrir les outils » pour les trois outils proposés.','Saisir une tâche dans la recherche centrale et cliquer Rechercher. Ce champ ouvre la recherche globale.','Utiliser les exemples : Copier un fichier ouvre les guides filtrés ; Préparer un compte rendu ouvre les prompts filtrés ; Transcrire un audio ouvre le studio.','Plus bas, choisir Windows, Word, Excel, audio, IA ou E-mails & agenda. Les quatre guides de démarrage sont une sélection fixe.','Consulter les encarts sur la transition Windows et la confidentialité IA.'])
heading('Ce que la page ne fait pas')
p('Elle ne détecte pas votre version de Windows, ne lit pas vos documents et ne personnalise pas les conseils selon votre métier. Les guides mis en avant ne sont pas déterminés par une mesure réelle de popularité. Il n’y a pas de flux de nouveautés datées.')
heading('Lecture critique')
p('Les couleurs crème, violet et vert rassurent et les actions principales sont visibles. L’illustration fournie contient déjà des éléments graphiques, auxquels s’ajoutent les cartes flottantes de l’interface : le rendu reste décoratif et ne démontre pas les fonctions. Sur mobile, l’image passe sous le texte et repousse la recherche plus bas. Le lien « E-mails & agenda » ne mène pour l’instant qu’à un guide de rendez-vous Outlook ; la promesse dépasse la profondeur du contenu.')

chapter('05 · Recherche globale : fonctionnement et échec observé','/recherche')
shot('14-recherche-pluriel','Essai réel : « copier des fichiers » affiche zéro résultat, malgré l’existence du guide correspondant.')
steps(['Ouvrir la loupe ou le champ de l’accueil. Saisir une tâche courte, par exemple « copier un fichier ».','Valider pour afficher les résultats répartis entre Tutoriels, Prompts et Articles.','Ouvrir une carte. Un résultat de prompt mène à une bibliothèque filtrée ; il faut ensuite cliquer « Adapter ce prompt ».','En cas d’absence de résultat, reformuler avec moins de mots ou consulter les ressources officielles.'])
heading('Algorithme réel')
p('Il supprime les accents, met les mots en minuscules et retire une liste de mots courants. Chaque mot restant doit correspondre à un titre, des mots-clés, une description ou une catégorie. Le titre pèse 5 points, les mots-clés 4, la description ou la catégorie 1. Le corps complet des guides n’est pas recherché. Aucun synonyme, correction de faute ou compréhension sémantique n’est appliqué.')
heading('Défaillances à retenir')
p('<b>Recherche trop littérale.</b> « copier un fichier » donne 1 résultat ; « copier des fichiers » en donne 0. Une expression ne contenant que des mots ignorés peut au contraire ramener tout le corpus. Les outils de l’annuaire et les pages d’information ne participent pas à cette recherche. Le libellé « recherche intelligente » du projet ne doit donc pas être compris comme un assistant conversationnel.')
p('Le message « 1 résultats » présente aussi une petite erreur de pluriel. Priorité : couvrir les variantes singulier/pluriel et les demandes usuelles, puis tester la pertinence auprès du public cible sans transmettre de requêtes sensibles à un service externe.')

chapter('06 · Catalogue de tutoriels et filtres','/guides')
shot('15-filtre-excel','Filtre Excel actif : quatre tutoriels sont disponibles.')
steps(['Saisir un mot dans le champ ; le résultat est mis à jour après une courte pause de frappe.','Choisir une catégorie : Windows 11, Windows 10, Word, Excel, Outlook, PowerPoint ou PDF.','Combiner une durée maximale (4 ou 6 minutes), un niveau et une version. Les critères se cumulent.','Lire le nombre de résultats, ouvrir une fiche ou cliquer « Tout effacer ». Un filtre sans correspondance affiche un état vide avec possibilité de réinitialisation.'])
p('<b>Répartition actuelle :</b> '+esc(' ; '.join(k+' : '+str(n) for k,n in collections.Counter(g['category'] for g in V['guides']).items()))+'.')
heading('Limites de ce catalogue')
p('Tous les guides sont classés Débutant ; le filtre de niveau n’offre donc qu’un seul niveau réel. Les durées sont indicatives, sans chronométrage d’utilisateurs. Il n’y a pas de tri manuel, de favoris, de recommandations personnalisées ni d’alerte automatique de contenu périmé. Les versions sont des étiquettes déclarées, pas une détection du logiciel installé.')
p('<b>Retour défectueux :</b> après avoir ouvert une fiche depuis le filtre Excel, « Retour aux tutoriels » ramène à /guides et affiche les 17 guides. Le cahier des charges demandait de préserver la recherche et ses filtres. Le retour du navigateur et le lien de la page sont deux actions différentes ; les confondre avait masqué ce défaut dans la vérification précédente.')

chapter('07 · Une fiche guide : toutes les commandes','/guides/copier-un-fichier')
shot('03-guide','Structure commune d’une fiche. Le schéma en haut n’est pas une capture de Windows.')
steps(['Vérifier le titre, la durée indicative, le niveau et la version ciblée. La date affichée est celle de consultation des sources.','Utiliser le sommaire « À votre rythme » pour aller à une section. Lire les étapes puis réaliser l’action dans votre vrai logiciel. Le site n’exécute pas ces manipulations.','Cocher la progression après chaque étape. Elle compte les cases cochées ; elle ne vérifie pas le résultat dans Word ou Excel.','Consulter les raccourcis lorsqu’ils existent et le lien vers la documentation de référence.','Utiliser « Copier les étapes », « Imprimer » ou « Marquer comme lu ». Le repère de lecture et les cases restent seulement dans la page.'])
heading('Détails importants')
p('La copie contient le titre et le texte Markdown complet, avec les signes ## et ### ; elle ne copie pas uniquement une liste d’étapes mise en forme. L’impression utilise la boîte de dialogue du navigateur. Il n’y a pas de téléchargement de fiche PDF dédié. Les trois contenus proposés en bas sont les premiers autres éléments du corpus, sans calcul de proximité avec le sujet.')
heading('Ce qui manque pour apprendre réellement')
p('Le schéma « Préparer / Réaliser / Vérifier » est réutilisé entre les guides, avec seulement l’icône et la catégorie adaptées. Les étapes n’ont pas de captures propres à chaque clic. Les conseils sont courts et prudents, mais souvent trop généraux pour quelqu’un qui ne sait pas trouver un menu. La présence d’une source Microsoft ne prouve pas que chaque procédure a été rejouée sur les logiciels installés.')

guide_improvements={
'capture-ecran':'Montrer la barre de capture, la notification, le choix du format et l’emplacement du fichier. Préciser le comportement selon la version de l’outil Capture.',
'copier-un-fichier':'Ajouter de vraies captures de l’Explorateur, la différence visuelle copie/déplacement, les conflits de noms et une méthode explicite pour retrouver un fichier perdu.',
'courrier-word':'Fournir un modèle de courrier et illustrer marges, alignements, paragraphes et enregistrement. Le guide actuel n’explique pas concrètement leur réglage.',
'exporter-pdf':'Distinguer Enregistrer sous et Exporter, montrer les options de pages et les marques de révision avec un exemple vérifiable.',
'figer-excel':'Illustrer la ligne supérieure, plusieurs lignes et colonnes, puis l’annulation. Le cas multi-lignes est actuellement renvoyé à la source.',
'filtrer-excel':'Le texte suppose déjà un tableau avec la colonne Statut et un filtre actif. Ajouter le prérequis, un jeu de données et le lien vers Créer un tableau.',
'modifier-pdf':'Montrer les différences avant/après et les limites d’un scan. Aucun OCR ou outil de modification PDF n’est fourni dans BureauClair.',
'notes-powerpoint':'Montrer la vue Notes et le mode Présentateur ; rejouer sur deux écrans et en visioconférence pour distinguer ce que voit le public.',
'presentation-powerpoint':'Ajouter un exemple de présentation téléchargeable, la sélection d’une disposition et la vérification des contrastes avec des captures.',
'raccourcis-windows':'Ajouter une démonstration contextualisée et une alternative par menus pour les utilisateurs ne pouvant pas utiliser les combinaisons de touches.',
'rendez-vous-outlook':'Le guide vise Outlook classique. Ajouter des parcours distincts pour le nouvel Outlook et le Web ; les e-mails et les réunions avec invités sont absents.',
'sauvegarde-windows':'Le guide reste une liste de précautions, sans procédure complète de sauvegarde/restauration. Illustrer un scénario local autorisé et les différences avec la synchronisation.',
'styles-word':'Illustrer la galerie de styles, le volet Navigation et la correction d’un titre mal hiérarchisé. Aucun fichier exemple n’est livré.',
'suivi-modifications':'Montrer les marques, accepter/refuser, les commentaires et le contrôle final. Masquer les marques et les supprimer doivent être visuellement distingués.',
'tableau-excel':'Ajouter un classeur d’exercice, une capture de la plage sélectionnée, la case En-têtes et le résultat final. La durée de 7 minutes est une estimation.',
'trier-excel':'Montrer le tri de dates et l’avertissement Étendre la sélection. Ajouter un exercice prouvant que les colonnes restent associées.',
'windows-10-transition':'Ce guide prépare la décision ; il ne migre pas le PC et ne vérifie pas automatiquement sa compatibilité. Prévoir une checklist testée avec un service informatique.'}

for i,g in enumerate(V['guides'],1):
 chapter(f'Guide {i:02d} · {g["title"]}','/guides/'+g['slug'])
 p(f'<b>{esc(g["category"])} · {g["minutes"]} min indicatives · {esc(g["level"])}</b><br/>{esc(g["version"])}')
 heading('Ce que la fiche vous fait faire')
 for title,body in re.findall(r'### ([^\n]+)\n\n(.*?)(?=\n\n### |\n\n## |\Z)',g['body'],re.S):p('<b>'+esc(title)+'</b><br/>'+esc(body.strip()))
 good=re.search(r'## Le bon réflexe\n\n(.*?)(?=\n\n## |\Z)',g['body'],re.S)
 if good:heading('Précaution présente dans la fiche');p(esc(good.group(1).strip()))
 if g.get('shortcuts'):p('<b>Raccourcis affichés :</b> '+esc(' ; '.join(g['shortcuts'])))
 p('<b>Média réel :</b> '+('schéma générique et démonstration locale de 12,04 s, sans son, avec une piste de sous-titres français.' if g['slug']=='copier-un-fichier' else 'schéma générique de la catégorie. Aucune vidéo ni capture propre aux étapes.'))
 heading('Limite et amélioration spécifique')
 p(esc(guide_improvements[g['slug']]))
 p('La procédure doit être réalisée dans votre logiciel sur une copie non sensible. Le site n’analyse pas le résultat et n’attribue aucune compétence ou certification. Les intitulés peuvent varier selon la version et les règles de votre organisation.','SmallFR')
 p('<b>Source déclarée :</b> <link color="#6755d7" href="'+esc(g['source'])+'">'+esc(g['sourceLabel'])+'</link> · consultation : 24/11/2026. Rédaction initiale : BureauClair.','SmallFR')

chapter('08 · Prompts : personnaliser une consigne','/prompts')
shot('21-prompt-dialogue','Fenêtre réelle : contexte, ton, longueur, aperçu et copie d’un prompt personnalisé.')
steps(['Chercher une tâche ou filtrer Réunion, Courriers, Excel, Organisation ou Documents.','Cliquer « Adapter ce prompt ». Lire l’objectif et l’avertissement avant de saisir un contexte non sensible.','Choisir un ton : cordial et professionnel, simple et direct ou formel. Choisir court, détaillé ou liste à puces.','Relire la consigne assemblée, puis « Copier mon prompt ». Coller ensuite vous-même dans un outil IA autorisé, si vous le souhaitez. BureauClair ne l’envoie pas.','Contrôler la réponse obtenue dans cet outil externe avant utilisation. Le bouton ne peut pas garantir son exactitude.'])
heading('Fonctionnement exact et limites')
p('Le texte remplace le champ [contexte], puis ajoute les choix de ton, de format et une demande de vérification. Le contexte est limité à 2 000 caractères. L’aperçu final est en lecture seule ; il n’existe pas de champ libre pour réécrire directement toute la consigne. Si le presse-papiers est refusé, un texte à sélectionner manuellement est proposé par le composant de copie.')
p('Les modèles sont réels, mais il n’y a pas de chat IA, de génération, de score de qualité ou d’exemples de réponses corrigées. Les préférences de ton/longueur restent pendant cette visite de la page ; le contexte est effacé à l’ouverture d’un autre modèle. Le résultat du test contient une double ponctuation lorsque le contexte se termine déjà par un point : détail éditorial à améliorer.')

chapter('09 · Les 20 prompts disponibles')
for c in dict.fromkeys(x['category'] for x in V['prompts']):
 heading(c)
 for x in (a for a in V['prompts'] if a['category']==c):p('<b>'+esc(x['title'])+'</b> — '+esc(x['description']),'ListFR')
p('Tous utilisent la même fenêtre de personnalisation et les mêmes trois paramètres. Aucun n’analyse automatiquement un fichier Word ou Excel. Les mentions « extraire », « synthèse », « formule » ou « planifier » décrivent la consigne préparée pour une IA tierce, pas une opération réalisée par le site.')
heading('Exemple de consigne actuelle : compte rendu')
p(esc(next(x['template'] for x in V['prompts'] if x['slug']=='compte-rendu')))
p('Ajouter des exemples de résultats vérifiés, montrer les erreurs fréquentes et faire essayer les modèles par des professionnels administratifs améliorerait fortement la valeur pédagogique. Cette évaluation qualitative n’a pas encore été menée.')

chapter('10 · Outils : ce que proposent les trois cartes','/outils')
shot('05-outils','Les trois entrées de la page Outils.')
table(['Carte / action','Résultat réel','Limite'],[['Ouvrir le studio','Navigation vers /studio.','Le module est expérimental et ne démarre pas sans action explicite.'],['Télécharger la trame','Fichier bureauclair-trame-compte-rendu.txt avec champs à compléter.','Texte brut vierge ; pas un compte rendu généré ni un modèle Word mis en page.'],['Explorer l’annuaire','Navigation vers /annuaire.','Les logiciels doivent être consultés ou installés séparément.']],[140,180,179])
p('La trame comporte Objet, Date, Participants, Points abordés, Décisions confirmées, Actions / responsable / échéance, Points à confirmer et Validation. Elle est produite directement dans le navigateur. Aucun document professionnel n’est lu pour la compléter.')
heading('Écart à l’ambition')
p('L’espace de modèles et fiches reste réduit à un seul TXT. Il manque des fichiers d’exercice, modèles bureautiques et exemples commentés. Leur absence n’empêche pas les trois actions de fonctionner, mais limite l’utilité au quotidien.')

chapter('11 · Studio : préparer et lancer une transcription','/studio')
shot('06-studio','Studio avant import : aucun modèle et aucun texte de démonstration chargé automatiquement.')
steps(['Utiliser un enregistrement autorisé, court et non sensible pour un premier essai. Choisir le fichier ou le déposer dans la zone prévue.','Vérifier le nom et le poids, puis réécouter avec le lecteur. L’application ne démarre pas le microphone.','Choisir Français, Anglais ou Arabe. Le français est prioritaire ; l’anglais et l’arabe n’ont pas de validation de qualité générale.','Cocher l’autorisation de téléchargement et cliquer « Charger le moteur local ». Attendre l’état prêt. Le téléchargement peut dépasser 100 Mo.','Cliquer « Transcrire cet audio ». L’interface montre l’état et le temps écoulé. Annuler arrête le worker ; il faut recharger le moteur pour reprendre.'])
heading('Moteur réellement utilisé')
p('Transformers.js charge Xenova/whisper-tiny, quantification q8, révision épinglée, et l’exécute dans un worker CPU / WebAssembly. L’audio est décodé, converti en mono à 16 kHz, puis reconnu par tranches de 30 secondes avec recouvrement de 5 secondes. Il n’y a pas de LLM conversationnel ni de tarification par tokens. WebGPU a été écarté après un test antérieur incohérent ; ce choix évite de proposer une option dont la qualité n’est pas validée.')
p('Le navigateur doit offrir Worker, AudioContext et WebAssembly, dans un contexte sécurisé HTTPS ou localhost. Cette détection vérifie la présence des fonctions ; elle ne mesure pas réellement la mémoire disponible ou la puissance de l’appareil. Les durées affichées ne sont pas une estimation fiable du temps restant.')

chapter('12 · Studio : relire, corriger, chercher et exporter','/studio')
shot('37-studio-transcrit','Résultat du nouvel essai : reconnaissance d’une phrase française synthétique, puis correction volontaire pour tester les exports.',maxh=255)
steps(['Lire et corriger le texte dans « Transcription à relire et corriger ». Le nombre de mots suit le texte édité.','Ouvrir les repères automatiques pour revoir les segments et leurs horaires approximatifs. La recherche porte sur les segments d’origine.','Réécouter le fichier au moyen du lecteur. Les repères ne sont pas des boutons permettant de déplacer automatiquement la lecture.','Exporter TXT ou DOCX, ou copier le texte. L’export contient le texte corrigé, sans structure de segments horodatés ni styles Word avancés.','Ouvrir le fichier exporté et vérifier noms, chiffres, dates, négations et décisions avant de l’utiliser.'])
heading('Ce que la correction ne modifie pas')
p('Les repères conservent la transcription automatique initiale. La recherche dans les repères ne recherche pas le texte corrigé et les horaires ne sont pas recalculés. Il n’existe pas d’édition segment par segment, de synchronisation clic-vers-audio, de distinction automatique des locuteurs ou d’export SRT/VTT. Ce sont des limites fonctionnelles réelles, pas seulement des détails visuels.')
heading('Nouveau test mesuré')
t=E.get('transcription',{})
if t.get('text'):
 p('Fixture française synthétique de 7,359 secondes, sans donnée professionnelle. Chargement observé : '+str(round(t['loadMs']/1000,2))+' s ; lancement et attente du résultat : '+str(round(t['inferMs']/1000,2))+' s. Texte reçu : « '+esc(t['text'])+' ».')
 p('Les nouveaux exports TXT et DOCX du texte corrigé ont été produits et comparés. Aucun POST n’a été observé dans cette session instrumentée. Ce résultat ne valide ni une réunion réelle ni la qualité sur les téléphones, accents, bruits ou langues variées.')
else:p('La reconnaissance n’a pas été intégralement rejouée dans cet audit. Les résultats antérieurs doivent être relus comme des essais de laboratoire et non une garantie actuelle sur tous les appareils.')

chapter('13 · Studio : notes, perte de travail et limites')
shot('23-notes','Onglet Notes manuelles rempli avec un texte de test ; ce document n’est pas généré par une IA.')
heading('Notes manuelles')
p('L’onglet contient une trame éditable : Objet, Date, Points abordés, Décisions confirmées, Actions / responsable / échéance et À confirmer. Vous devez la remplir. Les exports agissent sur l’onglet actif. Le TXT des notes est correctement nommé ; le DOCX des notes garde le nom bureauclair-transcription.docx, ce qui prête à confusion. Le bouton Copier n’apparaît dans cette zone que lorsqu’une transcription existe : les notes seules peuvent être exportées mais n’ont pas leur propre bouton de copie.')
heading('Perte de travail reproductible — priorité élevée')
p('Test réalisé : écrire une note, cliquer Blog dans l’en-tête, revenir au studio. La note a disparu et aucune confirmation n’a été présentée. Le code intercepte la fermeture ou l’actualisation de l’onglet avec beforeunload, mais pas le changement de route React. La page prévient de la durée de session ; néanmoins ce comportement reste fragile pour une personne débutante.')
p('« Effacer la session » arrête le moteur et remet les champs à zéro. La confirmation est conditionnée à l’existence d’un fichier ou d’une transcription, pas aux notes seules. Une note saisie seule peut donc aussi être effacée sans confirmation. Ce dernier point est établi par inspection du code, à rejouer en recette manuelle. Les fichiers déjà téléchargés et les caches du modèle ne sont pas supprimés.')
heading('Seuils et erreurs')
table(['Contrôle','Comportement actuel'],[['Poids','50 × 1 024 × 1 024 octets maximum, affiché comme 50 Mo.'],['Durée','10 minutes maximum, vérifiées après décodage complet du fichier en mémoire.'],['Formats','WAV, MP3, M4A ; MP4, WebM et OGG selon le codec du navigateur.'],['Erreurs','Fichier vide, poids, extension, type, décodage, chargement modèle, durée et navigateur. Le vrai manque de mémoire ne peut pas toujours être distingué.'],['Délais de sécurité','Chargement : arrêt en erreur au-delà de 5 min ; reconnaissance : au-delà de 10 min.'],['Solution de repli','Lien vers l’annuaire, notamment Buzz ; aucun envoi automatique vers le cloud.']],[110,389])

chapter('14 · Blog : liste et modèle d’article','/blog')
shot('07-blog','Le journal contient six articles courts, tous accessibles sans compte.')
steps(['Ouvrir Blog, choisir une catégorie ou conserver Tous.','Cliquer sur une carte pour lire l’article et utiliser son sommaire.','Consulter la source, copier, imprimer ou marquer la lecture. Ces contrôles sont partagés avec les fiches guides.','Revenir à Tous les articles ou ouvrir l’un des trois contenus proposés en bas.'])
heading('Fonctions et limites')
p('La liste filtre les catégories, sans champ de recherche propre au blog. La recherche globale peut retrouver certains articles. Les six textes sont de courts dossiers pratiques, pas un suivi régulier d’actualités. Tous affichent une durée de 3 minutes et une consultation des sources au 24 novembre 2026. Il n’y a pas de commentaires, d’abonnement, de publication programmée ou d’administration éditoriale.')
p('Le modèle commun conserve des libellés peu adaptés aux articles : « Copier les étapes » et un texte sur les versions d’Office peuvent apparaître alors que l’article traite de confidentialité. Les suggestions de bas de page ne sont pas sélectionnées pour leur proximité thématique. Le cahier des charges demandait des captures vérifiées pour les articles ; les six contenus n’en contiennent pas.')

for i,a in enumerate(V['articles'],1):
 chapter(f'Article {i:02d} · {a["title"]}','/blog/'+a['slug'])
 p('<b>'+esc(a['category'])+' · 3 min indicatives · Pour tous</b>')
 markdown(a['body'])
 heading('Ce que l’utilisateur obtient')
 p('Un conseil de méthode à lire, copier ou imprimer. Ce texte n’exécute aucune action sur l’ordinateur et ne constitue pas une vérification automatique de vos documents.')
 heading('Limite éditoriale')
 p('Le contenu expose des principes sans cas pratique détaillé, capture vérifiée ni exercice. Une relecture métier et un exemple concret contrôlé restent nécessaires. Le site indique une rédaction initiale, pas une validation exhaustive de la procédure.')
 p('<b>Source déclarée :</b> <link color="#6755d7" href="'+esc(a['source'])+'">'+esc(a['sourceLabel'])+'</link> · consultation : 24/11/2026.','SmallFR')

chapter('15 · Annuaire : choisir sans confusion','/annuaire')
shot('26-annuaire-filtre','Filtre local activé : Buzz, LibreOffice, VLC et Audacity sont affichés.')
steps(['Saisir le nom ou un usage dans le champ. Le texte est comparé au nom, à la catégorie et à la description.','Cocher « Options avec usage local » si vous voulez limiter la liste aux quatre ressources marquées locales.','Lire Compte, Coût, Licence et À savoir, puis ouvrir le site officiel dans un autre onglet.','Vérifier les conditions actuelles auprès du fournisseur avant d’installer ou de transmettre des données.'])
heading('Limites observées')
p('Le filtre local est un booléen. Microsoft 365 disparaît alors que certaines applications s’utilisent sur ordinateur ; le texte de sa carte explique cette nuance, mais le filtre ne représente pas les usages hybrides. La recherche de l’annuaire ne normalise pas les accents comme la recherche des guides et ses critères ne sont pas enregistrés dans l’URL.')
p('Les informations de prix sont volontairement prudentes et non chiffrées pour les offres variables. Ce n’est pas un comparateur tarifaire détaillé. Aucun outil n’est installé par le bouton et aucun lien n’indique une affiliation. Les sources déclarées sont celles du fournisseur ; leur existence ne remplace pas une évaluation complète de sécurité ou de conformité.')
for x in V['tools']:
 heading(x['name']+' · '+x['category'])
 p(esc(x['description'])+'<br/><b>Compte :</b> '+esc(x['account'])+'<br/><b>Coût :</b> '+esc(x['price'])+'<br/><b>Licence déclarée :</b> '+esc(x['license'])+'<br/><b>Limite :</b> '+esc(x['limit']))
 p('<link color="#6755d7" href="'+esc(x['url'])+'">Consulter la source de la carte</link>','SmallFR')

chapter('16 · Confidentialité : où vont les données ?','/confidentialite')
shot('09-confidentialite','Page de transparence. Ses déclarations doivent être adaptées à l’hébergeur choisi avant publication.',maxh=240)
table(['Élément','Traitement et limite'],[['Recherche','Classement dans le navigateur. Les mots sont dans l’URL : historique, lien partagé et éventuels journaux de l’hébergeur peuvent les contenir.'],['Prompts','Contexte tenu en mémoire ; copie au presse-papiers à votre demande. Aucun appel IA. Coller dans un service externe relève ensuite de ses conditions.'],['Audio et transcription','Fichier choisi lu sur l’appareil, traitement en worker, texte en mémoire de session ; pas d’API de réception des fichiers.'],['Modèle','Téléchargement explicite depuis Hugging Face / hébergeurs associés ; ils voient l’IP et les données techniques habituelles de la requête.'],['Cache','Interface et contenus mis en cache par la PWA ; modèle dans un cache distinct. La session effacée ne supprime pas tous les caches.'],['Exports','Fichiers conservés dans les téléchargements de l’utilisateur ; aucune suppression distante possible.'],['Médias','Illustrations et démonstration locales. Pas de lecteur YouTube chargé en arrière-plan.'],['Audience','Aucun outil publicitaire ou de mesure d’audience installé dans BureauClair.']],[105,394])
p('Le nouveau journal de requêtes confirme l’absence de POST dans le parcours studio testé. Cela décrit ce parcours, pas une certification de tous les environnements. JavaScript ne garantit pas l’effacement physique instantané de la mémoire. Le navigateur ou l’hébergeur peut avoir ses propres mécanismes indépendants de l’application.')

chapter('17 · Accessibilité : acquis et vérifications restantes','/accessibilite')
shot('10-accessibilite','Déclaration d’intention et limites explicites de la démarche.',maxh=240)
p('Le code prévoit des titres, vrais liens et boutons, champs étiquetés, focus visible, lien d’évitement, retours d’action via régions de statut et réduction des animations. Les menus et fenêtres sont utilisables au clavier. Les vidéos ne sont pas indispensables à la compréhension des fiches ; la démonstration comporte une piste française et du texte alternatif.')
heading('Pour les personnes malvoyantes')
p('Tester zoom 200 % et 400 %, contraste réel de tous les états, navigation avec NVDA/VoiceOver, ordre de lecture, annonces du moteur et déplacement du focus. Les petits textes secondaires et les pictogrammes exigent une vérification humaine ; une analyse automatique ne juge pas la facilité de lecture.')
heading('Pour les personnes sourdes ou malentendantes')
p('Le texte des tutoriels reste disponible. La démonstration est silencieuse. Toute future vidéo YouTube doit être examinée pour ses sous-titres et disposer d’un chemin textuel. Une transcription automatique audio peut aider, mais sa qualité ne constitue pas une garantie d’accessibilité et doit être contrôlée.')
heading('Ce qui n’est pas prouvé')
p('La cible WCAG 2.2 AA ne correspond pas à une conformité certifiée. Les tests ne remplacent ni l’audit manuel, ni les essais avec des personnes concernées, ni un contrôle sur de vrais téléphones. Aucun réglage dédié de taille du texte ou de contraste n’est actuellement proposé ; les réglages du navigateur restent disponibles.')

chapter('18 · Charte éditoriale','/editorial')
shot('11-editorial','La charte explique que les contenus sont en rédaction initiale.',maxh=245)
p('Cette page décrit quatre principes : une tâche par guide, transparence sur l’état initial, mises à jour versionnées et IA ne décidant pas à la place de l’utilisateur. Les liens latéraux conduisent aux autres pages de confiance.')
heading('Fonctionnement réel de la mise à jour')
p('Un responsable doit modifier les fichiers Markdown, les métadonnées et les listes TypeScript, puis reconstruire et publier le site. Il n’y a ni éditeur intégré, ni alerte de source expirée, ni workflow de validation. La date visible correspond à la consultation de la source ; elle ne doit pas être présentée comme une date de test de toutes les versions d’Office.')
heading('Amélioration nécessaire')
p('Distinguer à l’avenir consultation de la documentation, vérification pratique sur logiciel et validation métier, avec un responsable identifié et une échéance de révision. Les recommandations de cette page ne sont pas encore une organisation éditoriale mise en place. Les textes génériques réutilisés doivent être remplacés par des précautions propres à chaque tâche.')

chapter('19 · À propos, contact et adresse inconnue','/a-propos')
shot('12-a-propos','La zone Contact et publication contient encore une instruction à compléter.',maxh=235)
p('La page présente le public : secrétaires, assistantes, agents administratifs et personnes souhaitant comprendre leurs outils. Elle indique que BureauClair est un nom de travail et que le studio reste expérimental.')
heading('Contact non opérationnel')
p('Malgré le lien « À propos & contact », il n’y a pas d’adresse e-mail publique ni de formulaire. Le texte demande au propriétaire de renseigner éditeur, hébergeur et contact avant publication. Ce n’est pas une fonction de contact terminée. Aucun domaine public vérifié n’est fourni pour BureauClair à ce stade.')
heading('Quand l’adresse ne correspond à rien')
p('L’application affiche « Reprenons le bon chemin », avec Retour à l’accueil et Trouver un guide. Cet écran est bien présent. Sur l’hébergement statique futur, les règles de réécriture doivent servir index.html pour les routes de l’application. Cette récupération visuelle ne garantit pas un code HTTP 404 : la prévisualisation et certains hébergeurs retournent la page principale avec HTTP 200.')
shot('28-introuvable','Écran d’adresse inconnue testé en local.',maxh=190)

chapter('20 · Installation PWA et usage hors ligne')
shot('30-dialogue-installation','Le bouton peut ouvrir une aide plutôt qu’une boîte d’installation native.',maxh=250)
steps(['Lancer le build optimisé et ouvrir le site en ligne, sur localhost ou en HTTPS. Le mode de développement ne prépare pas ce cache hors ligne.','Attendre le message de disponibilité hors ligne. Cliquer Installer ; si le navigateur ne propose pas l’installation, suivre les instructions de son menu.','Sur iPhone, utiliser Partager puis Sur l’écran d’accueil ; ce parcours n’a pas été validé sur appareil physique.','Préparer les contenus avec une connexion avant de couper le réseau. Les guides et prompts peuvent alors être consultés.','Lors d’une mise à jour, exporter le travail du studio avant de l’appliquer, car recharger la page efface la session.'])
heading('Ce qui est réellement mis en cache')
p('L’interface, les images, les guides, les prompts et les articles font partie des ressources prévues. Le worker de transcription, les modèles et la vidéo ne font pas partie de ce précache. Un ancien cache du modèle ne garantit donc pas un studio utilisable hors ligne dès la première ouverture. Les liens vers Microsoft ou d’autres sites nécessitent Internet.')
p('Le nouveau test hors ligne a trouvé '+str(E.get('offline',{}).get('guides','non mesuré'))+' guides et '+str(E.get('offline',{}).get('prompts','non mesuré'))+' prompts après préparation. Il ne prouve pas une installation complète sur téléphone. Le cache peut être évincé par le navigateur en cas de manque d’espace. Une PWA installée ne transforme pas ce projet en application native distribuée sur les stores.')

chapter('21 · YouTube : ce qui était demandé et ce qui manque')
p('<b>Le besoin YouTube n’a pas été livré sous la forme prévue.</b> Le cahier des charges, section 08 « Contenus pédagogiques et workflow éditorial », prévoit : « Miniature + titre + producteur + durée + vérification du contenu et de la version ; ouverture contrôlée. » Il précise également des vidéos facultatives dans les guides et interdit la copie de vidéos sans droits.')
table(['Critère attendu','État actuel'],[['Sélection de vidéos vérifiées','Absente : aucun inventaire de vidéos YouTube dans les contenus.'],['Miniature, titre, producteur et durée','Aucune fiche YouTube comportant ces métadonnées.'],['Correspondance avec la tâche et la version','Non renseignée pour des vidéos tierces ; aucune validation éditoriale associée.'],['Ouverture contrôlée / refus / indisponibilité','Aucun composant dédié aux vidéos YouTube et à leurs états.'],['Sous-titres ou alternative textuelle','Les guides ont du texte. L’unique vidéo locale a une piste française ; cela ne couvre pas une sélection YouTube inexistante.'],['Pas de chargement tiers automatique','Respecté aujourd’hui parce qu’il n’y a aucun lecteur tiers. Cette qualité de confidentialité ne compense pas l’absence du contenu demandé.'],['Démonstration existante','Un WebM local de 12,04 secondes sur la copie d’un fichier ; schéma silencieux, pas une capture de Windows et pas une vidéo YouTube.']],[205,294])
p('Le cahier des charges décrit un gabarit de vidéo ; il n’impose pas explicitement une route autonome nommée YouTube. Il faut donc distinguer « pas de page YouTube dédiée » et « pas de fiches vidéo conformes ». Le second point est l’écart certain. Même une page dédiée vide ne résoudrait pas ce manque.')
heading('Pourquoi la démonstration locale ne suffit pas')
p('Elle explique seulement le principe de copie. Elle ne montre pas où cliquer dans les logiciels, ne couvre pas Word, Excel, Outlook ou PowerPoint et n’offre pas les métadonnées de sélection demandées. Avant lecture, son absence d’image d’affiche laisse une grande zone peu informative ; ajouter une vraie vignette serait une amélioration UX.')

chapter('22 · YouTube : recette précise à exiger pour la suite')
steps(['Identifier pour chaque tâche prioritaire une vidéo provenant d’un producteur identifiable, puis visionner son contenu réellement. Ne pas inventer de titre, de durée ou de validation.','Enregistrer URL/identifiant, titre, producteur, durée, langue, version du logiciel, passages utiles, présence des sous-titres, date et responsable du contrôle.','Afficher une vignette et les informations en HTML accessible. Éviter un chargement de vignette externe avant consentement si la politique vise l’absence de requêtes tierces.','Proposer soit un lien clairement annoncé vers YouTube, soit un lecteur chargé seulement après action explicite. Conserver toutes les étapes textuelles.','Tester vidéo supprimée, privée, intégration refusée, connexion absente, sous-titres manquants et version différente. Le visiteur doit pouvoir poursuivre le tutoriel.','Vérifier les droits : un lien ou une intégration autorisée ne permet pas de télécharger et republier la vidéo. Documenter la source de toute miniature ou capture locale utilisée.'])
heading('Données à ajouter au modèle éditorial')
table(['Champ','Exemple de contenu attendu, sans donnée inventée'],[['video.url / provider','Lien réel contrôlé ; fournisseur identifié.'],['video.title / producer / duration','Titre exact, producteur identifié et durée constatée.'],['softwareVersion / language','Version montrée, langue audio et sous-titres disponibles.'],['checkedAt / checkedBy','Date de visionnage et personne ayant validé l’adéquation.'],['availability / fallback','État actuel et alternative textuelle en cas d’échec.'],['rights / thumbnailSource','Conditions d’utilisation et provenance du visuel.']],[180,319])
p('La politique de sécurité actuelle n’autorise pas un lecteur YouTube intégré. Une future intégration demanderait d’adapter la directive frame-src et le mécanisme de consentement, puis de vérifier les requêtes réseau. Un simple lien externe fonctionne sans ouvrir cette possibilité dans la page. Ces éléments sont des exigences de correction à venir ; ils n’ont pas été ajoutés pendant cet audit.')

chapter('23 · Écarts au cahier des charges : tableau de synthèse')
table(['Exigence','Évaluation et limite'],[['Accueil, navigation, six accès','Opérationnel ; pas de rubrique de nouveautés, recherche peu tolérante.'],['Trouver en 2 ou 3 interactions','Possible sur les exemples prévus, pas mesuré avec des utilisateurs ; pluriel simple en échec.'],['15–25 guides / 20 prompts / 6 articles','Quantités atteintes : 17 / 20 / 6. La qualité pédagogique reste à approfondir.'],['Guides illustrés, versions, sources','Partiel : étapes et métadonnées présentes, schémas répétitifs, captures contextualisées absentes.'],['Vidéo / gabarit YouTube','Partiel pour la vidéo au sens large ; fiches YouTube absentes.'],['Retour en conservant les filtres','Non respecté par le lien Retour aux tutoriels ; précédent du navigateur distinct.'],['Prompts personnalisables','Opérationnel ; pas de génération intégrée ni d’exemples de réponses corrigées.'],['Articles concrets et captures vérifiées','Partiel : six textes courts avec sources, sans captures ou exercices.'],['Annuaire commenté','Opérationnel mais limité à six ressources ; classification hybride à revoir.'],['Transcription locale après POC','Pilote réel sur cet ordinateur ; qualité terrain et appareils physiques non validées.'],['Édition des segments et repères','Partiel : texte global éditable ; segments initiaux en lecture seule ; pas de recherche dans les corrections.'],['TXT / DOCX','Opérationnel pour texte brut corrigé et notes ; nom du DOCX de notes ambigu.'],['Résumé automatique','Absent conformément au MVP prudent ; une trame manuelle est présente. Ne pas le compter comme une promesse livrée.'],['Compatibilité appareil et erreurs','Détection des API et messages présents ; pas de mesure fiable de mémoire ou de capacité avant décodage.'],['PWA','Cache et manifeste présents ; installation physique et comportement du domaine futur à valider.'],['Accessibilité AA','Dispositifs présents ; audit manuel et tests avec personnes concernées restent à faire.'],['Contact et publication','Incomplets : contact éditeur/hébergeur non renseignés, pas de mise en ligne publique.'],['Administration / comptes / e-mails intégrés','Non prévus au MVP ; leur absence n’est pas un défaut de réalisation.']],[185,314])

chapter('24 · Défaillances et priorités de correction')
p('P1 : à traiter avant une diffusion large ou une tâche réelle sensible au risque de perte. P2 : amélioration significative de compréhension ou de qualité. P3 : détail de finition. Cette hiérarchie n’annonce pas des corrections effectuées.')
findings=[
('F01 · P1 · Notes perdues en navigation','Test : notes saisies → Blog → retour studio. Résultat : trame réinitialisée, aucune confirmation. Cause : état React local et beforeunload ne bloquant pas les routes internes.','src/Studio.tsx ; captures 23-notes ; audit-captures.json, perte-notes-navigation.','Demander confirmation sur tout départ avec travail non exporté, ou proposer une sauvegarde locale explicitement consentie. Ne pas introduire de stockage caché contraire au cahier des charges.'),
('F02 · P1 · Recherche singulier/pluriel','« copier un fichier » : 1 ; « copier des fichiers » : 0. Tous les mots significatifs doivent correspondre littéralement.','src/lib/content.ts ; captures 13 et 14.','Accepter les variantes usuelles, fautes et synonymes contrôlés ; vérifier un corpus de demandes réelles, avec explication en cas de résultat incertain.'),
('F03 · P1 · Volet YouTube absent','Aucune vidéo sélectionnée avec titre, producteur, durée et contrôle de version. Le WebM local ne couvre pas le gabarit demandé.','Cahier des charges §08 ; src/pages.tsx ; inventaire des contenus ; capture 19.','Livrer des fiches de vidéos vérifiées et leur ouverture contrôlée ; valider les états de refus et les sous-titres.'),
('F04 · P1 · Pédagogie trop générique','Même schéma Préparer/Réaliser/Vérifier ; pas de visuel montrant précisément chaque manipulation. Les procédures n’ont pas été rejouées sur toutes les versions annoncées.','src/pages.tsx, GuideIllustration ; les 17 fichiers Markdown ; capture 03.','Produire captures ou démonstrations authentiques et exercices pour les tâches prioritaires ; faire valider par le public métier.'),
('F05 · P2 · Filtres perdus au retour','Le lien Retour aux tutoriels pointe toujours vers /guides. Le test Excel revient à 17 résultats.','src/pages.tsx, Detail ; captures 15 et 16.','Restituer la recherche d’origine et le contexte de liste ; tester lien interne et historique séparément.'),
('F06 · P1 · Contact et publication inachevés','À propos & contact ne contient aucun moyen de contacter l’éditeur ; aucun domaine public n’est livré.','src/info.tsx ; capture 12.','Renseigner l’opérateur et le contact, choisir un hébergeur, vérifier les règles SPA/PWA/HTTPS et le traitement de ses journaux avant ouverture publique.'),
('F07 · P1 · Studio validé sur corpus trop étroit','La phrase synthétique propre n’évalue ni réunions, bruit, silences, accents ni téléphone réel. Une API disponible n’est pas une preuve de capacité.','Nouveaux résultats de cet audit et limites explicites du README.','Mesurer qualité, erreurs critiques, durée, mémoire et reprise sur corpus autorisé et appareils physiques ; conserver l’étiquette expérimentale.'),
('F08 · P2 · Segments peu exploitables','Recherche sur les segments automatiques, pas le texte corrigé ; horaires non cliquables ; édition segmentée absente.','src/Studio.tsx ; capture 37 si disponible.','Clarifier les deux versions, synchroniser lecture et segments si prévu, tester export des corrections et des horaires sans confusion.'),
('F09 · P2 · Effacement des notes seules','Par inspection, clear() ne demande confirmation que si text ou file existe ; des notes seules ne déclenchent pas la garde.','src/Studio.tsx, fonction clear ; non rejoué en interface dans cette série.','Inclure toute modification des notes dans le critère de confirmation, sans annoncer un effacement des exports ou caches.'),
('F10 · P2 · Classification local/cloud simplifiée','Microsoft 365 est exclu du filtre local malgré ses applications de bureau ; l’étiquette binaire ne distingue pas les usages hybrides.','src/content/tools.ts ; captures 08 et 26.','Décrire les traitements par fonction et proposer une catégorie hybride ; vérifier les paramètres plutôt que promettre un local absolu.'),
('F11 · P2 · Contenu déséquilibré','Une seule fiche Outlook, aucun parcours de rédaction/envoi de mail dans ce module ; absence de modèles de documents et d’exercices.','Inventaire de 17 guides et accueil E-mails & agenda.','Prioriser les tâches administratives fréquentes et livrer des exemples autorisés plutôt qu’ajouter des cartes superficielles.'),
('F12 · P3 · Finitions de texte et export','« 1 résultats », Markdown brut à la copie, double ponctuation de prompt, DOCX des notes nommé transcription ; libellés de guide réutilisés dans les articles.','src/pages.tsx, src/lib/export.ts ; tests copie et exports.','Adapter les libellés et noms au contexte, corriger les accords et vérifier les sorties réellement utilisées.'),
('F13 · P2 · Préparation hors ligne ambiguë','Pages préparées ne signifie pas moteur ou vidéo disponibles ; cache et dépendances du worker distincts.','vite.config.ts, Layout.tsx ; nouveau test hors ligne.','Séparer clairement disponibilité des textes, de la vidéo et du studio, avec contrôle concret de chaque ressource.'),
('F14 · P2 · Validation accessibilité incomplète','Aucun échec automatisé ne prouve une bonne lecture par NVDA/VoiceOver ou une navigation confortable sur mobile réel.','Rapport Axe de cet audit, captures mobiles et source de la page accessibilité.','Faire un audit manuel et des essais assistés ; corriger d’abord les obstacles aux tâches essentielles.'),
('F15 · P2 · Décodage avant contrôle de durée','La limite 10 min est vérifiée après chargement/décodage complet. Un fichier compressé de moins de 50 Mo peut quand même consommer beaucoup de mémoire.','src/lib/audio.ts, decodeAudio ; constat statique, pas de saturation volontaire.','Évaluer une prélecture de durée ou une stratégie de découpage et documenter les limites ; tester sur appareil peu puissant.')]
for title,obs,evidence,action in findings:
 heading(title);p('<b>Constat :</b> '+esc(obs));p('<b>Preuve :</b> '+esc(evidence),'SmallFR');p('<b>Résultat attendu :</b> '+esc(action))

chapter('25 · Tests réellement exécutés pour ce document')
axe=E.get('axe',[]);violations=sum(len(x['violations']) for x in axe)
table(['Contrôle','Résultat de cette série'],[['Tests unitaires','npm.cmd test : 11 tests réussis, un fichier de tests.'],['Routes ordinateur','35 adresses de contenu ouvertes, titres présents ; aucune image cassée et aucun débordement horizontal relevés. Écran inconnu testé séparément.'],['Contrôle automatisé desktop/mobile',str(len(axe))+' analyses Axe : '+str(violations)+' anomalie(s) relevée(s) sur les règles A/AA ciblées ; vue 1440 × 1000 et 390 × 844.'],['Captures fraîches','Accueil, listes, guide, actions, prompt, studio, informations, installation, erreurs et mobile ; fichiers PNG et snapshots d’accessibilité conservés.'],['Recherche','Singulier positif et pluriel en échec ; comportement documenté, pas corrigé.'],['Guide','Case de progression, marquer lu et copie essayés. La copie contient le Markdown. Source de la vidéo locale chargée et piste détectée.'],['Retour filtres','Défaut reproduit : 4 guides Excel → fiche → lien retour → 17 guides.'],['Prompt','Contexte et ton modifiés ; copie relue dans le presse-papiers.'],['Studio notes','TXT et DOCX téléchargés ; perte après navigation interne reproduite.'],['Fichier refusé','Fichier .txt rejeté avec message explicite.'],['Reconnaissance',('Nouvelle transcription de la fixture française ; correction et exports réels.' if E.get('transcription',{}).get('text') else 'Non aboutie dans cette série ; consulter la limite technique ci-dessous.')],['Réseau studio',str(len(E.get('transcription',{}).get('posts',[])))+' POST observé(s) pendant le parcours instrumenté ; téléchargement externe du moteur explicite.'],['Hors ligne','Après préparation : '+str(E.get('offline',{}).get('guides','non mesuré'))+' guides et '+str(E.get('offline',{}).get('prompts','non mesuré'))+' prompts.'],['Console','Aucune exception pageerror relevée dans les parcours terminés. Les échecs attendus de validation sont des messages d’interface, pas des erreurs JavaScript.']],[155,344])
if E.get('failure'):p('<b>Limite du script complémentaire :</b> '+esc(E['failure']))
p('Les tests audio longs, l’annulation, les formats MP3/M4A et le benchmark WebGPU du rapport précédent ne sont pas présentés comme rejoués ici. Les tests externes de disponibilité Microsoft/YouTube, le build, le déploiement public et l’installation native n’ont pas été relancés pour cet audit documentaire. Les liens de sources sont ceux du catalogue existant, pas une nouvelle sélection vidéo vérifiée.')
heading('Fichiers de preuve de cette série')
bullet('audit-captures.json : parcours, actions, erreurs et résultats de navigation.')
bullet('audit-verifications.json : contrôles Axe, studio, vidéo et cache hors ligne.')
bullet('captures/*.png et *.txt : images et états d’accessibilité ; aucun ancien screenshot n’est réutilisé dans ce PDF.')
bullet('audit-notes.txt/.docx et transcription-corrigee.txt/.docx : exports de données de test non sensibles.')

chapter('26 · Votre fiche de recette pour décider des améliorations')
p('À utiliser avec des personnes réellement proches du public cible. Cocher un résultat après avoir vu l’action réussir, et noter le logiciel, sa version, l’appareil et les difficultés. Les objectifs du cahier des charges sont des hypothèses de conception, pas des résultats obtenus.')
table(['Scénario à rejouer','Résultat à observer'],[['Comprendre l’accueil','La personne choisit une action utile en moins de 15 s, sans explication du concepteur. Cible initiale : 8 personnes sur 10.'],['Trouver un guide','Essayer singulier/pluriel, fautes et formulation métier. Cible initiale : 80 % atteignent la bonne fiche en 3 clics ou moins.'],['Réaliser une manipulation','Ouvrir Word/Excel/Outlook réel, exécuter la tâche sur une copie et vérifier le résultat. Cible initiale : 70 % achèvent une tâche simple.'],['Préserver le contexte','Filtrer, ouvrir une fiche puis utiliser son lien Retour. Les mêmes critères doivent rester. Échec actuel documenté.'],['Comprendre le local','Faire expliquer quelles données restent sur l’appareil et quelles requêtes téléchargent le modèle. Cible : compréhension par tous les participants.'],['Vidéo vérifiée','Contrôler titre/producteur/durée/version, sous-titres et lecture à la demande ; puis simuler vidéo indisponible. Fonction absente actuellement.'],['Travail du studio','Transcrire un extrait autorisé, corriger un nom, exporter et comparer ; naviguer ailleurs sans perdre silencieusement le travail.'],['Mobile / accessibilité','Tester vrai téléphone, zoom, clavier externe, lecteur d’écran, sous-titres et commandes d’export.'],['Publication','Ouvrir une URL profonde depuis un autre appareil ; vérifier HTTPS, absence de références privées, PWA, contact et politique de confidentialité.']],[145,354])
heading('Questions à noter pour chaque page')
steps(['Ai-je compris en quelques secondes ce que je peux faire ici ?','Le bouton produit-il le résultat annoncé, avec un message clair en cas d’échec ?','Ai-je assez de captures et d’exemples pour accomplir la tâche dans mon logiciel ?','Puis-je revenir, annuler ou quitter sans perdre mon travail ?','Le texte est-il lisible et l’action possible sur téléphone et au clavier ?','Quelle correction précise rendrait cette page utile à mon travail réel ?'])

chapter('27 · Lancer le site et transmettre ce rapport')
heading('Ouvrir la version de développement')
for line in [r'cd C:\Users\maison1\Documents\BureauClair','npm.cmd ci','npm.cmd run dev'] :p(esc(line))
p('Puis ouvrir <link href="http://localhost:5173" color="#6755d7">http://localhost:5173</link>. L’installation des dépendances demande Internet ; ne pas lancer une seconde instance sur un port déjà occupé. Garder le terminal ouvert ; Ctrl + C arrête le serveur.')
heading('Ouvrir le build et la PWA')
p('npm.cmd run build<br/>npm.cmd run preview')
p('Puis ouvrir <link href="http://localhost:4175" color="#6755d7">http://localhost:4175</link>. Le port 4175 a été utilisé pour cet audit. Si la prévisualisation tourne déjà, son adresse est directement utilisable. Le build statique sort dans dist/. Aucun secret ou compte cloud n’est nécessaire pour les fonctions actuelles.')
heading('Maintenance et préparation à l’hébergement')
p('Composants : src/components/. Pages : src/pages.tsx, src/Studio.tsx et src/info.tsx. Contenus : src/content/. Recherche et audio : src/lib/. PWA et build : vite.config.ts. Tests : tests/. Les références d’origine restent dans references/ et ne font pas partie de l’application publiée. Les en-têtes et règles SPA préparés doivent être réellement pris en charge par l’hébergeur choisi.')
heading('Pour partager')
p('Ce PDF contient ses images et ses explications : vous pouvez l’envoyer par e-mail ou messagerie. Les adresses localhost ne donnent pas accès à votre ordinateur depuis l’extérieur. Le PDF ne publie pas le site. Un hébergement public distinct, avec les informations de l’éditeur, reste à configurer et à vérifier.')
heading('Ordre recommandé pour la prochaine intervention')
steps(['Prévenir la perte de travail du studio et corriger recherche / retour aux filtres.','Livrer les vidéos vérifiées et les captures utiles au lieu de considérer les schémas génériques comme suffisants.','Renforcer les tâches administratives prioritaires, en particulier Outlook et les exercices bureautiques.','Valider audio, accessibilité et PWA sur des appareils réels, puis préparer l’ouverture publique.'])
p('Aucun de ces correctifs n’a été appliqué dans le cadre de la réalisation de ce rapport. Le document donne un état des lieux et des critères concrets pour la suite.','SmallFR')

pdf=OUT/'BureauClair_Guide_complet_et_audit.pdf'
doc=Report(str(pdf),pagesize=(595.276,841.89),rightMargin=48,leftMargin=48,topMargin=46,bottomMargin=57,title='BureauClair — Guide complet et audit de la version actuelle',author='BureauClair — documentation technique et fonctionnelle',subject='Tutoriel détaillé de chaque page, écarts au cahier des charges et YouTube',pageCompression=1)
doc.multiBuild(story,onFirstPage=footer,onLaterPages=footer)
print(str(pdf))
