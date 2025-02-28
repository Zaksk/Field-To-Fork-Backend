import pandas as pd
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import plotly.express as px


file_path = 'fruitvegprices-2017_2022.csv'

df = pd.read_csv(file_path)

# Convert date column to datetime
df['date'] = pd.to_datetime(df['date'])

# Replace underscores with spaces 
df['category'] = df['category'].str.replace('_', ' ')
df['item'] = df['item'].str.replace('_', ' ')
df['variety'] = df['variety'].str.replace('_', ' ')

print(df['category'].unique())
app = dash.Dash(suppress_callback_exceptions=False)

# Layout
app.layout = html.Div([
    html.H1("Fruit and Vegetable Prices in the UK (2017-2022)"),

    # Category selection radio button
    html.Label("Select Category:"),
    dcc.RadioItems(
        id='category-radio',
        options=[{'label': cat, 'value': cat}
                 for cat in df['category'].unique()],
        value=df['category'].unique()[0],
        inline=True
    ),

    # Item selection dropdown
    html.Label("Select Item:"),
    dcc.Dropdown(
        id='item-dropdown',
        options=[],  # Populated dynamically
        value=None,
        placeholder="Select an item"
    ),

    # Variety selection dropdown
    html.Label("Select Variety:"),
    dcc.Dropdown(
        id='variety-dropdown',
        options=[],  # Populated dynamically
        value=None,
        placeholder="Select a variety"
    ),

    # Price dynamics scatter plot
    dcc.Graph(id='price-scatter')
])

# Callback to update item dropdown based on selected category


@app.callback(
    [Output('item-dropdown', 'options'),
     Output('item-dropdown', 'value')],
    [Input('category-radio', 'value')]
)
def update_item_dropdown(selected_category):
    filtered_items = df[df['category'] == selected_category]['item'].unique()
    options = [{'label': item, 'value': item} for item in filtered_items]
    return options, (options[0]['value'] if options else None)

# Callback to update variety dropdown based on selected item


@app.callback(
    [Output('variety-dropdown', 'options'),
     Output('variety-dropdown', 'value')],
    [Input('category-radio', 'value'),
     Input('item-dropdown', 'value')]
)
def update_variety_dropdown(selected_category, selected_item):
    if not selected_item:
        return [], None

    filtered_varieties = df[(df['category'] == selected_category) & (
        df['item'] == selected_item)]['variety'].unique()
    
    options = [{'label': var, 'value': var} for var in filtered_varieties]
    return options, (options[0]['value'] if options else None)

# Callback to update scatter plot based on category, item, and variety


@app.callback(
    Output('price-scatter', 'figure'),
    [Input('category-radio', 'value'),
     Input('item-dropdown', 'value'),
     Input('variety-dropdown', 'value')]
)
def update_scatter_plot(selected_category, selected_item, selected_variety):
    if not selected_item or not selected_variety:
        return px.scatter()

    # Filter data
    filtered_df = df[(df['category'] == selected_category) &
                     (df['item'] == selected_item) &
                     (df['variety'] == selected_variety)]
    price_type = filtered_df['unit'].unique()[0] if not filtered_df.empty else "Unknown"

     
    # Sort by date
    filtered_df = filtered_df.sort_values(by='date')

    # Scatter plot
    fig = px.scatter(
        filtered_df,
        x='date',
        y='price',
        title=f'Price Dynamics for {selected_item} ({selected_variety}) per {price_type} Over Time',
        labels={'price': 'Price', 'date': 'Date'},
        template='plotly_dark'
    )

    return fig

# Run the app
if __name__ == '__main__':
    app.run_server(host='localhost', port=3500)
